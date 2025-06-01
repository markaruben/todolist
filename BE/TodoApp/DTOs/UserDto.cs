using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TodoApp.DTOs
{
  public class UserDto
  {
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public List<TodoItemDto> TodoItems { get; set; } = new List<TodoItemDto>();
  }

  public class UserRegisterDto
  {
    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;
  }
}