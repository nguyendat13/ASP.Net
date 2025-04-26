using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PhatDat_TH2.Data;
using System.Text;
using PhatDat_TH2.Hubs;
using Microsoft.AspNetCore.SignalR;
using PhatDat_TH2.Services;
using System.Security.Claims;
using PhatDat_TH2.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5094); // HTTP
    options.ListenLocalhost(7177, listenOptions =>
    {
        listenOptions.UseHttps();
    });
});

// Cấu hình JWT Bearer Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
           Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!)
        )
    };


    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // Cho phép truyền token qua query string khi kết nối WebSocket
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chathub"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            // Đảm bảo SignalR nhận được UserIdentifier chính xác
            var claimsIdentity = context.Principal?.Identity as System.Security.Claims.ClaimsIdentity;
            var userId = claimsIdentity?.FindFirst("userId")?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                claimsIdentity.AddClaim(new System.Security.Claims.Claim(ClaimTypes.NameIdentifier, userId));
            }
            return Task.CompletedTask;
        }
    };
});

// Cấu hình DbContext và Swagger
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Chỉ cho phép origin cụ thể
             .AllowAnyMethod()
             .AllowAnyHeader()
             .AllowCredentials(); // Quan trọng để cho phép cookie và headers đặc biệt
    });
});
// Đảm bảo đăng ký ChatService
builder.Services.AddScoped<ChatService>(); // Hoặc AddSingleton<ChatService>(), tùy vào yêu cầu
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddControllers(); // Đảm bảo chỉ sử dụng API controller
builder.Services.AddSignalR(); // Thêm SignalR vào dịch vụ

// Swagger để test API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpClient();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "PhatDat API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token JWT vào đây"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // Hiển thị chi tiết lỗi 500
}

// Middleware
app.UseSwagger();
app.UseSwaggerUI();

// Sử dụng CORS trước khi xử lý yêu cầu
app.UseCors("AllowAllOrigins");

// Đảm bảo gọi UseRouting() trước UseAuthentication và UseAuthorization
app.UseRouting(); // Đặt sau UseCors, nhưng trước UseAuthentication và UseAuthorization

// Sử dụng Authentication và Authorization
app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();  // Quan trọng để phục vụ tệp tĩnh như hình ảnh

// Cấu hình API Controller
app.MapControllers();

// Cấu hình SignalR Hub
app.MapHub<ChatHub>("/chathub"); // Đăng ký SignalR Hub

app.Run();
