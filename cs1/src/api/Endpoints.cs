public class Endpoints(NotesService service)
{
    public void MapEndpoints(IEndpointRouteBuilder routes)
    {
        var tasksGroup = routes.MapGroup("/tasks");

        tasksGroup.MapGet("/{id}", GetById);
        tasksGroup.MapPost("/", GetPage);
        tasksGroup.MapPost("/add", Add);
        tasksGroup.MapPost("/delete/{id}", Delete);
    }

    private async Task<IResult> GetPage(Pagination pagination)
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

    private async Task<IResult> GetById(string id)
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

    private async Task<IResult> Add(TaskRecord task)
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

    private async Task<IResult> Delete(string id)
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