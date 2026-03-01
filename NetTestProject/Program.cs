using Microsoft.EntityFrameworkCore;
using NetTestProject;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TodoDb>(options => options.UseInMemoryDatabase("TodoList"));
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJSOrigin", builder =>
    {
        builder.WithOrigins("http://192.168.10.9:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
var app = builder.Build();

app.UseCors("AllowNextJSOrigin");

app.MapGet("/todoitems", async (TodoDb db) =>
    await db.Todos.Select(t => new TodoResponseDto(t.Id, t.Name, t.IsComplete)).ToListAsync());

app.MapGet("/todoitems/complete", async (TodoDb db) =>
    await db.Todos.Where(x => x.IsComplete).ToListAsync());

app.MapPost("/todoitems", async (TodoCreateRequestDto todoRequest, TodoDb db) =>
{
    if (todoRequest is null)
        return Results.BadRequest("Todo task JSON missing!");

    var Todo = new Todo
    {
        Name = todoRequest.name,
        IsComplete = todoRequest.isComplete
    };

    try {
        db.Todos.Add(Todo);
        await db.SaveChangesAsync();
    } catch {
        throw new Exception("Todo request could not be added!");
    }

    return Results.Created($"/todoitems/{Todo.Id}", new TodoResponseDto(Todo.Id, Todo.Name, Todo.IsComplete));
});

app.MapPatch("/todoitems/{id}", async (int id, TodoPatchRequestDto dto, TodoDb db) =>
{
    var todo = await db.Todos.FindAsync(id);
    if (todo == null)
        return Results.NotFound();

    if (dto.isComplete.HasValue)
        todo.IsComplete = dto.isComplete.Value;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/todoitems/{id}", async (int id, TodoDb db) =>
{
    var todo = await db.Todos.FindAsync(id);
    if (todo == null)
        return Results.NotFound($"Could not find items with Id {id}");

    db.Remove(todo);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();
