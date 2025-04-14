using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class TopicController : ControllerBase
{
    private readonly AppDbContext _context;

    public TopicController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetTopics() => Ok(_context.Topics.Include(t => t.Posts).ToList());

    [HttpGet("{id}")]
    public IActionResult GetTopic(int id)
    {
        var topic = _context.Topics.Include(t => t.Posts).FirstOrDefault(t => t.Id == id);
        if (topic == null) return NotFound();
        return Ok(topic);
    }

    [HttpPost]
    public IActionResult Create(Topic topic)
    {
        _context.Topics.Add(topic);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetTopic), new { id = topic.Id }, topic);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, Topic updated)
    {
        var topic = _context.Topics.Find(id);
        if (topic == null) return NotFound();

        topic.Title = updated.Title;
        topic.Description = updated.Description;
        _context.SaveChanges();

        return Ok(topic);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var topic = _context.Topics.Find(id);
        if (topic == null) return NotFound();

        _context.Topics.Remove(topic);
        _context.SaveChanges();
        return NoContent();
    }
}
