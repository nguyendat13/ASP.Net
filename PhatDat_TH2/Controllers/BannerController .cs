using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;

[Route("api/[controller]")]
[ApiController]
public class BannerController : ControllerBase
{
    private readonly AppDbContext _context;

    public BannerController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetBanners() => Ok(_context.Banners.ToList());

    [HttpGet("{id}")]
    public IActionResult GetBanner(int id)
    {
        var banner = _context.Banners.Find(id);
        if (banner == null) return NotFound();
        return Ok(banner);
    }

    [HttpPost]
    public IActionResult Create(Banner banner)
    {
        _context.Banners.Add(banner);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetBanner), new { id = banner.Id }, banner);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, Banner updated)
    {
        var banner = _context.Banners.Find(id);
        if (banner == null) return NotFound();

        banner.ImageUrl = updated.ImageUrl;
        banner.Link = updated.Link;
        _context.SaveChanges();

        return Ok(banner);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var banner = _context.Banners.Find(id);
        if (banner == null) return NotFound();

        _context.Banners.Remove(banner);
        _context.SaveChanges();
        return NoContent();
    }
}
