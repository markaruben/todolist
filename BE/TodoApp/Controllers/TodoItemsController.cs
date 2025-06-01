using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Data;
using TodoApp.Models;
using TodoApp.DTOs;
using System.Security.Claims;

namespace TodoApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TodoItemsController : ControllerBase
    {
        private readonly TodoContext _context;

        public TodoItemsController(TodoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItemDto>>> GetTodoItems()
        {
            var items = await _context.TodoItems.Include(t => t.User).ToListAsync();

            var itemsDto = items.Select(t => new TodoItemDto
            {
                Id = t.Id,
                Title = t.Title,
                IsCompleted = t.IsCompleted
            }).ToList();

            return Ok(itemsDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItemDto>> GetTodoItem(int id)
        {
            var item = await _context.TodoItems.Include(t => t.User)
                                               .FirstOrDefaultAsync(t => t.Id == id);

            if (item == null) return NotFound();

            var itemDto = new TodoItemDto
            {
                Id = item.Id,
                Title = item.Title,
                IsCompleted = item.IsCompleted
            };

            return Ok(itemDto);
        }

        [HttpPost]
        public async Task<ActionResult<TodoItemDto>> CreateTodoItem(TodoItemDto todoItemDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("nameid");

            if (userIdClaim == null)
            {
                return Unauthorized("UserId not found in token");
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return BadRequest("Invalid UserId in token");
            }

            var todoItem = new TodoItem
            {
                Title = todoItemDto.Title,
                IsCompleted = todoItemDto.IsCompleted,
                UserId = userId
            };

            _context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();

            todoItemDto.Id = todoItem.Id;

            return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItemDto);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodoItem(int id, TodoItemDto updatedItemDto)
        {
            if (id != updatedItemDto.Id) return BadRequest();

            var existingItem = await _context.TodoItems.FindAsync(id);
            if (existingItem == null) return NotFound();

            existingItem.Title = updatedItemDto.Title;
            existingItem.IsCompleted = updatedItemDto.IsCompleted;

            _context.Entry(existingItem).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(int id)
        {
            var item = await _context.TodoItems.FindAsync(id);
            if (item == null) return NotFound();

            _context.TodoItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
