using Hangfire;
using Hangfire.Dashboard;
using Microsoft.AspNetCore.Builder;
using Xdoc.Configuration.Hangfire;

namespace Xdoc.Configuration.Hangfire
{
    public class HangfireConfiguration
    {
        public static void AddHangfire(IApplicationBuilder app, bool isFreeAccess = false)
        {
            var filters = isFreeAccess? new IDashboardAuthorizationFilter[]
            {
                new FreeDashboardAuthorizationFilter()
            } : 
            new IDashboardAuthorizationFilter[]
            {
                new MyDashboardAuthorizationFilter()
            };

            app.UseHangfireDashboard("/hangfire", new DashboardOptions
            {
                Authorization = filters
            });
            app.UseHangfireServer();
        }
    }
}