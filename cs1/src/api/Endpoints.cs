using Microsoft.AspNetCore.Mvc;

public static class Endpoints
{
    public static void MapEndpoints(IEndpointRouteBuilder routes)
    {
        var tasksGroup = routes.MapGroup("/tasks");

        tasksGroup.MapGet("/{id:guid}", GetById);
        tasksGroup.MapPost("/page", GetPage);
        tasksGroup.MapPost("/", Add);
        tasksGroup.MapDelete("/{id:guid}", Delete);
    }

    private static async Task<IResult> GetPage([FromServices] NotesService service, [FromBody] Pagination pagination)
    {
        List<TaskRecord> page;
        try
        {
            page = await service.GetPage(pagination);
        }
        catch (Exception e)
        {
            return Results.Problem(e.ToString());
        }

        return Results.Ok(page);
    }

    private static async Task<IResult> GetById([FromServices] NotesService service, [FromRoute] string id)
    {
        TaskRecord? result;
        try
        {
            result = await service.GetById(id);
            if (result is null)
            {
                return Results.NotFound();
            }
        }
        catch (Exception e)
        {
            return Results.Problem(e.ToString());
        }

        return Results.Ok(result);
    }

    private static async Task<IResult> Add([FromServices] NotesService service, [FromBody] TaskRecord task)
    {
        try
        {
            await service.Add(task);
        }
        catch (Exception e)
        {
            return Results.Problem(e.ToString());
        }

        return Results.Ok();
    }

    private static async Task<IResult> Delete([FromServices] NotesService service, [FromRoute] string id)
    {
        try
        {
            await service.Delete(id);
        }
        catch (Exception e)
        {
            return Results.Problem(e.ToString());
        }

        return Results.Ok();
    }
}