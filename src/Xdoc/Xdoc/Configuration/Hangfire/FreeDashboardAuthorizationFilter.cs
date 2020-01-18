using Hangfire.Dashboard;

namespace Xdoc.Configuration.Hangfire
{
    public class FreeDashboardAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            //Разрешаем вообще всем пользователям доступ к дашборду
            return true;
        }
    }
}