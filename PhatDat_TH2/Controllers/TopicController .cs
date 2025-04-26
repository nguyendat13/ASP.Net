using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model.DTO;
using PhatDat_TH2.Model;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class TopicController : ControllerBase
{
    private readonly AppDbContext _context;

    public TopicController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTopics()
    {
        var topics = await _context.Topics
            .Select(t => new TopicDTO
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description
            })
            .ToListAsync();

        return Ok(topics);
    }

  [HttpGet("{id}")]
public async Task<IActionResult> GetTopic(int id)
{
    var topic = await _context.Topics
        .Include(t => t.Posts)
        .Where(t => t.Id == id)
        .Select(t => new TopicDTO
        {
            Id=t.Id,
            Title = t.Title,
            Description = t.Description,
            Posts = t.Posts.Select(p => new PostDTO
            {
                Title = p.Title,
                Content = p.Content,
                TopicId = p.TopicId
            }).ToList()
        })
        .FirstOrDefaultAsync();

    if (topic == null) return NotFound();

    return Ok(topic);
}


    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TopicDTO topicDto)
    {
        var topic = new Topic
        {
            Title = topicDto.Title,
            Description = topicDto.Description
        };

        _context.Topics.Add(topic);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTopic), new { id = topic.Id }, topic);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TopicDTO topicDto)
    {
        var topic = await _context.Topics.FindAsync(id);
        if (topic == null) return NotFound();

        topic.Title = topicDto.Title;
        topic.Description = topicDto.Description;

        await _context.SaveChangesAsync();

        return Ok(topic);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var topic = await _context.Topics.FindAsync(id);
        if (topic == null) return NotFound();

        _context.Topics.Remove(topic);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
