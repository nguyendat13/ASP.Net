using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using PhatDat_TH2.Data;
using Microsoft.EntityFrameworkCore;

public class NotificationCleanupService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public NotificationCleanupService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var oneDayAgo = DateTime.UtcNow.AddDays(-1);

                var oldNotifications = await context.Notifications
                    .Where(n => n.CreatedAt < oneDayAgo)
                    .ToListAsync(stoppingToken);

                if (oldNotifications.Any())
                {
                    context.Notifications.RemoveRange(oldNotifications);
                    await context.SaveChangesAsync(stoppingToken);
                }
            }

            // Chạy mỗi 1 giờ
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }
}
