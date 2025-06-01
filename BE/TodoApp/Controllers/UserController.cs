using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Data;
using TodoApp.Models;
using TodoApp.DTOs;

namespace TodoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly TodoContext _context;

        public UsersController(TodoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users.Include(u => u.TodoItems).ToListAsync();

            var usersDto = users.Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                TodoItems = u.TodoItems.Select(t => new TodoItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    IsCompleted = t.IsCompleted
                }).ToList()
            }).ToList();

            return Ok(usersDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.Include(u => u.TodoItems)
                                           .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return NotFound();

            var userDto = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                TodoItems = user.TodoItems.Select(t => new TodoItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    IsCompleted = t.IsCompleted
                }).ToList()
            };

            return Ok(userDto);
        }
    }
}
