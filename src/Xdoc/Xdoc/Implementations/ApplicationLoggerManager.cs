using System;
using System.Threading.Tasks;
using Croco.Core.Implementations.AmbientContext;
using Croco.Core.Implementations.TransactionHandlers;
using Xdoc.Abstractions;

namespace Xdoc.Implementations
{
    public class ApplicationLoggerManager : ILoggerManager
    {
        public Task LogExceptionAsync(Exception ex)
        {
            if (ex == null)
            {
                return Task.CompletedTask;
            }

            return new CrocoTransactionHandler(() => new SystemCrocoAmbientContext()).ExecuteAndCloseTransaction(ctx =>
            {
                ctx.Logger.LogException(ex);

                return Task.CompletedTask;
            });
        }
    }
}