using FluentValidation;

public static class ServiceProviderExtensions
{
    public static IValidator? GetValidator(this IServiceProvider serviceProvider, Type type)
    {
        return serviceProvider.GetService(typeof(IValidator<>).MakeGenericType(type)) as IValidator;
    }
}

public class ValidationFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        foreach (var arg in context.Arguments)
        {
            if (arg is null)
            {
                continue;
            }

            var validator = context.HttpContext.RequestServices.GetValidator(arg.GetType());

            if (validator is null)
            {
                continue;
            }

            IValidationContext validationContext = new ValidationContext<object>(arg);
            var validationResult = await validator.ValidateAsync(validationContext);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

        }

        return await next(context);
    }
}