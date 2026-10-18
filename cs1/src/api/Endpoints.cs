using System.Text.Json;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi;

public sealed class RequestBodyExampleMetadata(string json)
{
    public string Json { get; } = json;
}

public static class Endpoints
{
    public static void MapEndpoints(IEndpointRouteBuilder routes)
    {
        var tasksGroup = routes.MapGroup("/tasks");

        tasksGroup.MapGet("/{id:guid}", GetById);
        tasksGroup.MapPost("/page", GetPage).AddOpenApiOperationTransformer((operation, context, ct) =>
        {
            operation.RequestBody ??= new OpenApiRequestBody();

            operation.RequestBody.Content?["application/json"] =
                new OpenApiMediaType
                {
                    Example = JsonSerializer.SerializeToNode(new
                    {
                        Filter = new object[]{
                            new {
                                Group = new
                                {
                                    Junction = "Or",
                                    Terms = new object[]{
                                    new {
                                        Group = new {
                                            Junction = "And",
                                             Terms = new object[]{
                                                new {
                                                    Options = new
                                                    {
                                                        Field = "Title",
                                                        Op = "eq",
                                                        Value = "MyTitle1"
                                                    }
                                                },
                                                new {
                                                    Options = new
                                                    {
                                                        Field = "Deadline",
                                                        Op = "lte",
                                                        Value = new DateTime(year:2003, month:01, day:28)
                                                    }
                                                },
                                             }
                                        }
                                    },
                                    new {
                                        Options = new
                                        {
                                            Field = "Title",
                                            Op = "eq",
                                            Value = "MyTitle"
                                        }
                                    }
                                }
                                }
                            }
                        },
                        SortOptions = new
                        {
                            Field = "Title",
                            Direction = 1
                        },
                        Start = 0,
                        Limit = -1,
                    })
                };

            return Task.CompletedTask;
        });
        tasksGroup.MapPut("/", Add);
        tasksGroup.MapDelete("/{id:guid}", Delete);
    }

    private static async Task<Results<Ok<List<TaskRecord>>, BadRequest<string>, ProblemHttpResult>> GetPage([FromServices] NotesService service, [FromBody] Pagination pagination)
    {
        List<TaskRecord> page;
        try
        {
            page = await service.GetPage(pagination);
        }
        catch (Exception e) when (e is InvalidOperationException or ArgumentException or InvalidCastException)
        {
            return TypedResults.BadRequest(e.Message);
        }
        catch (Exception e)
        {
            return TypedResults.Problem(e.ToString());
        }

        return TypedResults.Ok(page);
    }

    private static async Task<Results<Ok<TaskRecord>, NotFound, ProblemHttpResult>> GetById([FromServices] NotesService service, [FromRoute] Guid id)
    {
        TaskRecord? result;
        try
        {
            result = await service.GetById(id);
            if (result is null)
            {
                return TypedResults.NotFound();
            }
        }
        catch (Exception e)
        {
            return TypedResults.Problem(e.ToString());
        }

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Guid>, ProblemHttpResult>> Add([FromServices] NotesService service, [FromBody] APITaskRecord task)
    {
        TaskRecord entity = task.ToDomain();

        Guid newID;
        try
        {
            newID = await service.Add(entity);
        }
        catch (Exception e)
        {
            return TypedResults.Problem(e.ToString());
        }

        return TypedResults.Ok(newID);
    }

    private static async Task<Results<Ok, NotFound, ProblemHttpResult>> Delete([FromServices] NotesService service, [FromRoute] Guid id)
    {
        try
        {
            var deleted = await service.Delete(id);
            if (!deleted)
            {
                return TypedResults.NotFound();
            }
        }
        catch (Exception e)
        {
            return TypedResults.Problem(e.ToString());
        }

        return TypedResults.Ok();
    }
}