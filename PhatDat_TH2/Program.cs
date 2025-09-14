using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PhatDat_TH2.Data;
using PhatDat_TH2.Hubs;
using PhatDat_TH2.Library;
using PhatDat_TH2.Model;
using PhatDat_TH2.Repository;
using PhatDat_TH2.Repository.IRepository;
using PhatDat_TH2.Services;
using PhatDat_TH2.Services.IServices;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//builder.WebHost.ConfigureKestrel(options =>
//{
//    options.ListenLocalhost(5094); // HTTP
//    options.ListenLocalhost(7177, listenOptions =>
//    {
//        listenOptions.UseHttps();
//    });
//});
builder.WebHost.ConfigureKestrel(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        // Chạy local
        options.ListenLocalhost(5094); // HTTP
        options.ListenLocalhost(7177, listenOptions =>
        {
            listenOptions.UseHttps();
        });
    }
    else
    {
        // Khi deploy Docker/Render
        options.ListenAnyIP(5000);
    }
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme; // Thêm Cookie Authentication
})
  .AddCookie(options =>
  {
      options.LoginPath = "/login-user";  // Đường dẫn đăng nhập của bạn
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
            var claimsIdentity = context.Principal?.Identity as ClaimsIdentity;
            var userId = claimsIdentity?.FindFirst("userId")?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                claimsIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, userId));
            }
            return Task.CompletedTask;
        }
    };
})

.AddGoogle("Google", options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    options.CallbackPath = "/signin-google";

    options.Events.OnCreatingTicket = async context =>
    {
        var email = context.Principal.FindFirst(ClaimTypes.Email)?.Value;
        var name = context.Principal.FindFirst(ClaimTypes.Name)?.Value;

        var dbContext = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();

        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            user = new PhatDat_TH2.Model.User
            {
                Fullname = name ?? "No Name",
                Email = email,
                Username = email.Split('@')[0],
                Password = "",
                Role = "user",
                Phone = "",
                Gender = "",
                Status = true,
                CreatedBy = "Google",
                CreatedAt = DateTime.Now
            };

            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();
        }

        // Thêm claim để xử lý về sau (nếu cần JWT tạo thủ công sau khi login)
        var identity = (ClaimsIdentity)context.Principal.Identity;
        identity.AddClaim(new Claim("userId", user.Id.ToString()));
        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));
    };
});

// Cấu hình DbContext và Swagger
//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 36)) // Railway đang chạy MySQL 8.x
    )
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.WithOrigins( "https://beamish-bunny-1b5d79.netlify.app")
                     .AllowAnyMethod()
             .AllowAnyHeader()
             .AllowCredentials(); // Quan trọng để cho phép cookie và headers đặc biệt
    });
});
// Đảm bảo đăng ký ChatService
builder.Services.AddScoped<ChatService>(); // Hoặc AddSingleton<ChatService>(), tùy vào yêu cầu
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IVnPayService, VnPayService>();

builder.Services.AddControllers(); // Đảm bảo chỉ sử dụng API controller
builder.Services.AddSignalR(); // Thêm SignalR vào dịch vụ

// Swagger để test API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpClient();
builder.Services.Configure<GeminiSettings>(builder.Configuration.GetSection("GeminiAi"));

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
