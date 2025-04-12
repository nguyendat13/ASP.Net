using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;

[Route("api/[controller]")]
[ApiController]
public class MenuController : ControllerBase
{
    private readonly AppDbContext _context;

    public MenuController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetMenus() => Ok(_context.Menus.ToList());

    [HttpGet("{id}")]
    public IActionResult GetMenu(int id)
    {
        var menu = _context.Menus.Find(id);
        if (menu == null) return NotFound();
        return Ok(menu);
    }

    [HttpPost]
    public IActionResult Create(Menu menu)
    {
        _context.Menus.Add(menu);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetMenu), new { id = menu.Id }, menu);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, Menu updated)
    {
        var menu = _context.Menus.Find(id);
        if (menu == null) return NotFound();

        menu.Name = updated.Name;
        menu.Url = updated.Url;
        _context.SaveChanges();

        return Ok(menu);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var menu = _context.Menus.Find(id);
        if (menu == null) return NotFound();

        _context.Menus.Remove(menu);
        _context.SaveChanges();
        return NoContent();
    }
}
