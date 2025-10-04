using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using PhatDat_TH2.Model.DTO;
using PhatDat_TH2.Services.IServices;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace PhatDat_TH2.Services
{
    public class ActivityLogService : IActivityLogService
    {
        private readonly AppDbContext _context;

        public ActivityLogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ActivityLog> LogAsync(
            int? userId,
            string action,
            string entityType,
            int? entityId = null,
            object details = null,
            string ip = null,
            string userAgent = null)
        {
            var log = new ActivityLog
            {
                UserId = userId,
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                Details = details == null ? null : JsonSerializer.Serialize(details, new JsonSerializerOptions
                {
                    WriteIndented = false,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                }),
                IpAddress = ip,
                UserAgent = userAgent,
                CreatedAt = DateTime.UtcNow
            };

            _context.ActivityLogs.Add(log);
            await _context.SaveChangesAsync();
            return log;
        }

        public async Task<PaginatedResult<ActivityLog>> GetLogsAsync(ActivityLogQuery query)
        {
            var q = _context.ActivityLogs.AsNoTracking().AsQueryable();

            if (query.UserId.HasValue)
                q = q.Where(x => x.UserId == query.UserId.Value);

            if (!string.IsNullOrWhiteSpace(query.EntityType))
                q = q.Where(x => x.EntityType == query.EntityType);

            if (!string.IsNullOrWhiteSpace(query.Action))
                q = q.Where(x => x.Action == query.Action);

            // Xử lý From/To theo date-range (From inclusive, To inclusive)
            if (query.From.HasValue)
            {
                var from = query.From.Value.Date; // 2025-10-03 00:00:00
                q = q.Where(x => x.CreatedAt >= from);
            }

            if (query.To.HasValue)
            {
                var nextDay = query.To.Value.Date.AddDays(1); // exclusive upper bound
                q = q.Where(x => x.CreatedAt < nextDay);
            }

            var total = await q.CountAsync();

            var items = await q
                .OrderByDescending(x => x.CreatedAt)
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return new PaginatedResult<ActivityLog>
            {
                Items = items,
                TotalCount = total,
                Page = query.Page,
                PageSize = query.PageSize
            };
        }

        public async Task DeleteLogAsync(int id)
        {
            var log = await _context.ActivityLogs.FindAsync(id);
            if (log != null)
            {
                _context.ActivityLogs.Remove(log);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAllLogsAsync()
        {
            _context.ActivityLogs.RemoveRange(_context.ActivityLogs);
            await _context.SaveChangesAsync();
        }
    }
}
