using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Data; // thay bằng namespace project của bạn
using PhatDat_TH2.Model; // thay bằng namespace chứa model StatusOrder

[Route("api/[controller]")]
[ApiController]
public class StatusOrderController : ControllerBase
{
    private readonly AppDbContext _context;

    public StatusOrderController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/StatusOrder
    [HttpGet]
    public async Task<IActionResult> GetAllStatusOrders()
    {
        var statuses = await _context.StatusOrders.ToListAsync();
        return Ok(statuses);
    }
}
