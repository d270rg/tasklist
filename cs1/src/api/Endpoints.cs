using System.Text.Json;
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
                                                // new {
                                                //     Options = new
                                                //     {
                                                //         Field = "Deadline",
                                                //         Op = "lte",
                                                //         Value = new DateTime(year:2003, month:01, day:28)
                                                //     }
                                                // },
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

    private static async Task<IResult> GetPage([FromServices] NotesService service, [FromBody] Pagination pagination)
    {
        List<TaskRecord> page;
        try
        {
            page = await service.GetPage(pagination);
        }
        catch (Exception e) when (e is InvalidOperationException or ArgumentException or InvalidCastException)
        {
            return Results.BadRequest(e.Message);
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

    private static async Task<IResult> Add([FromServices] NotesService service, [FromBody] APITaskRecord task)
    {
        TaskRecord entity = task.ToDomain();

        try
        {
            await service.Add(entity);
        }
        catch (Exception e)
        {
            return Results.Problem(e.ToString());
        }

        return Results.Ok();
    }

    private static async Task<IResult> Delete([FromServices] NotesService service, [FromRoute] Guid id)
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