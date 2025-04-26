using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model.DTO;

[Route("api/[controller]")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardStatsDTO>> GetDashboardStats()
    {
        var stats = new DashboardStatsDTO
        {
            TotalProducts = await _context.Products.CountAsync(),
            TotalUsers = await _context.Users.CountAsync(),
            TotalOrders = await _context.Orders.CountAsync(),
            Revenue = await _context.Orders.SumAsync(o => o.TotalPrice),
            TotalPosts = await _context.Posts.CountAsync()
        };

        return Ok(stats);
    }
}
