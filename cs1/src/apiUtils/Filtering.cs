using System.Linq.Expressions;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Text.Json.Serialization;
using LinqKit;



[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Junction
{
    Null,
    And,
    Or
}

public record SortOptions(string Field, int Direction);

public record FilterOptions(string Field, string Op, JsonElement Value);

public record Pagination(FilterGroup? Filter, SortOptions? Sort, int Start = 0, int Limit = -1);

public record FilterNode(FilterGroup? Group, FilterOptions? Options);

/**
{
    filter: {
        terms: [
           {
              junction: "and",
              terms: [
                {
                    field: "Title",
                    op: "eq",
                    value: "123"
                },
                {
                    juntion: "or",
                    terms: []
                }
              ]
           }
        ]
    }
}
*/
public record FilterGroup(Junction Junction, FilterNode[]? Terms);

static partial class PredicateSpinner<Entity> where Entity : class
{
    public static ExpressionStarter<Entity> Unwrap(FilterGroup filterGroup, [Optional] ExpressionStarter<Entity> predicate)
    {
        var newPredicate = predicate ?? PredicateBuilder.New<Entity>();
        foreach (var term in filterGroup.Terms ?? [])
        {
            newPredicate = UnwrapTerm(filterGroup.Junction, term, predicate ?? PredicateBuilder.New<Entity>());
        }

        return newPredicate;
    }

    private static ExpressionStarter<Entity> UnwrapTerm(Junction junction, FilterNode term, ExpressionStarter<Entity> predicate)
    {
        if (term.Group is not null && term.Options is not null)
        {
            throw new InvalidCastException("Operator value should be either FilterGroup or FilterOptions, it can't be both");
        }

        if (term.Group is not null)
        {
            return Unwrap(term.Group, predicate);
        }
        else
            if (term.Options is not null)
            {
                return ProccessOptionsLeaf(junction, term, predicate);
            }
            else
            {
                throw new InvalidCastException("Invalid operator value, value of operator should be FilterGroup or FilterOptions");
            }
    }

    private static ExpressionStarter<Entity> ProccessOptionsLeaf(Junction junction, FilterNode term, ExpressionStarter<Entity> predicate)
    {
        var field = typeof(Entity).GetProperty(term.Options!.Field,
                    BindingFlags.IgnoreCase
                    | BindingFlags.Public
                    | BindingFlags.Instance)
                   ?? throw new ArgumentException($"Property '{term.Options.Field}' not found.");

        var entity = Expression.Parameter(typeof(Entity));

        var value = Expression.Constant(
            term.Options.Value.Deserialize(field.PropertyType),
            field.PropertyType);

        var entityField = Expression.Property(entity, field);

        var convertedValue = Expression.Convert(value, field.PropertyType);

        Expression<Func<Entity, bool>> lambda;

        try
        {
            lambda = term.Options.Op.ToLower() switch
            {
                "eq" => Expression.Lambda<Func<Entity, bool>>(
                               Expression.Equal(
                                   entityField,
                                   convertedValue),
                               entity),
                "gt" => Expression.Lambda<Func<Entity, bool>>(
                        Expression.GreaterThan(
                            entityField,
                            convertedValue),
                        entity),
                "lt" => Expression.Lambda<Func<Entity, bool>>(
                        Expression.LessThan(
                            entityField,
                            convertedValue),
                        entity),
                "gte" => Expression.Lambda<Func<Entity, bool>>(
                        Expression.GreaterThanOrEqual(
                            entityField,
                            convertedValue),
                        entity),
                "lte" => Expression.Lambda<Func<Entity, bool>>(
                        Expression.LessThanOrEqual(
                            entityField,
                            convertedValue),
                        entity),
                "ne" => Expression.Lambda<Func<Entity, bool>>(
                        Expression.NotEqual(
                            entityField,
                            convertedValue),
                        entity),
                _ => throw new NotImplementedException("Unknown operator"),
            };
        }
        catch
        {
            throw new InvalidOperationException($"Operation {term.Options.Op} invalid for value type {field.PropertyType.Name} at field {field.Name}");
        }



        var newPredicate = junction switch
        {
            Junction.And => (ExpressionStarter<Entity>)predicate.And(lambda),
            Junction.Or => (ExpressionStarter<Entity>)predicate.Or(lambda),
            _ => throw new InvalidCastException("Invalid operator key, operator key should be `And` or `Or` in any case"),
        };

        return newPredicate;
    }
}