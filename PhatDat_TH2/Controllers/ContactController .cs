using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;

[Route("api/[controller]")]
[ApiController]
public class ContactController : ControllerBase
{
    private readonly AppDbContext _context;

    public ContactController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetContacts() => Ok(_context.Contacts.ToList());

    [HttpGet("{id}")]
    public IActionResult GetContact(int id)
    {
        var contact = _context.Contacts.Find(id);
        if (contact == null) return NotFound();
        return Ok(contact);
    }

    [HttpPost]
    public IActionResult Create(Contact contact)
    {
        _context.Contacts.Add(contact);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, Contact updated)
    {
        var contact = _context.Contacts.Find(id);
        if (contact == null) return NotFound();

        contact.Name = updated.Name;
        contact.Email = updated.Email;
        contact.Message = updated.Message;

        _context.SaveChanges();
        return Ok(contact);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var contact = _context.Contacts.Find(id);
        if (contact == null) return NotFound();

        _context.Contacts.Remove(contact);
        _context.SaveChanges();
        return NoContent();
    }
}
