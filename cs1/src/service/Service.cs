using System.Reflection;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.SwaggerGen;

public class NotesService(ApplicationDbContext context)
{
    public async Task<PaginationResponse> GetPage(Pagination pagination)
    {
        IQueryable<TaskRecord> query = context.Tasks;
        int size;

        if (pagination.Filter is not null)
        {
            var predicate = PredicateSpinner<TaskRecord>.Unwrap(pagination.Filter);
            query = query.Where(predicate);
        }

        if (pagination.Sort is not null)
        {
            var isAsc = pagination.Sort.Direction is SortDirection.Asc;
            query = pagination.Sort.Field.ToLower() switch
            {
                "Title" => isAsc ? query.OrderBy(t => t.Title) : query.OrderByDescending(t => t.Title),
                "Deadline" => isAsc ? query.OrderBy(t => t.Deadline) : query.OrderByDescending(t => t.Deadline),
                "Priority" => isAsc ? query.OrderBy(t => t.Priority) : query.OrderByDescending(t => t.Priority),
                "ID" or _ => isAsc ? query.OrderBy(t => t.ID) : query.OrderByDescending(t => t.Priority)
            };
        }

        size = query.Count();
        query = query.Skip(pagination.Start);

        if (pagination.Limit != -1)
        {
            query = query.Take(pagination.Limit - pagination.Start);
        }

        var valuesList = await query.ToListAsync();
        return new(valuesList, size);
    }

    public async Task<TaskRecord?> GetById(Guid id)
    {
        return await context.Tasks.FindAsync(id);
    }

    public async Task<Guid> Add(TaskRecord taskRecord)
    {
        var created = context.Tasks.Add(taskRecord);
        await context.SaveChangesAsync();
        return (Guid)created.Entity.ID!;
    }

    public async Task<TaskRecord?> Update(Guid id, APITaskRecordUpdate taskUpdate)
    {
        var entityToUpdate = context.Tasks.FirstOrDefault(t => t.ID == id);
        if (entityToUpdate is null)
        {
            return null;
        }

        JsonPatchDocument updateOp = new();

        var properties = typeof(TaskRecord).GetProperties();

        foreach (var prop in properties)
        {
            if (prop.HasAttribute<StonedAttribute>())
            {
                throw new ArgumentException($"Unable to mutate property {prop.Name}");
            }

            var updateProperty = typeof(APITaskRecordUpdate).GetProperty(prop.Name,
                                                                            BindingFlags.IgnoreCase
                                                                            | BindingFlags.Public
                                                                            | BindingFlags.Instance);
            if (updateProperty is not null)
            {
                var value = updateProperty.GetValue(taskUpdate);
                if (value is not null)
                {
                    updateOp.Add($"/{prop.Name}", value);
                }
                else
                {
                    if (new NullabilityInfoContext().Create(prop).WriteState is NullabilityState.Nullable)
                    {
                        updateOp.Remove($"/{prop.Name}");
                    }
                    else
                    {
                        throw new ArgumentException($"Unable to delete required property {prop.Name}");
                    }
                }
            }
        }

        updateOp.ApplyTo(entityToUpdate);
        await context.SaveChangesAsync();

        return entityToUpdate;
    }

    public async Task<bool> Delete(Guid id)
    {
        var deleted = await context.Tasks.Where(task => task.ID == id).ExecuteDeleteAsync();
        await context.SaveChangesAsync();
        return deleted > 0;
    }
}