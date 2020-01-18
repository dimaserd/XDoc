using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using Croco.Core.Abstractions.Application;
using Hangfire;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Xdoc.Configuration.Hangfire;
using Xdoc.Configuration.Swagger;
using Xdoc.CrocoStuff;
using Xdoc.Extensions;
using Xdoc.Implementations;
using Xdoc.Logic.Services;
using Xdoc.Model.Contexts;
using Xdoc.Model.Entities.Users.Default;

namespace Xdoc
{
    public class Startup
    {
        public const string DevelopmentEnvironmentName = "Development";

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Croco = new StartupCroco(new StartUpCrocoOptions
            {
                Configuration = configuration,
                Env = env,
                ApplicationActions = new List<Action<ICrocoApplication>>
                {
                    ApplicationServiceRegistrator.Register
                },
            });
        }

        StartupCroco Croco { get; }
        public IConfiguration Configuration { get; }

        private static void ConfigureJsonSerializer(JsonSerializerOptions settings)
        {
            settings.PropertyNameCaseInsensitive = true;
            settings.PropertyNamingPolicy = null;
            settings.Converters.Add(new JsonStringEnumConverter());
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews().AddRazorRuntimeCompilation();

            services.Configure<FormOptions>(options =>
            {
                options.MultipartBodyLengthLimit = int.MaxValue; // In case of multipart
                options.ValueCountLimit = 200; // 200 items max
                options.ValueLengthLimit = 1024 * 1024 * 100; // 100MB max len form data
            });

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddTransient<ApplicationUserManager>();
            services.AddTransient<ApplicationSignInManager>();

            services.AddDbContext<XdocDbContext>(options =>
            {
                options.UseSqlServer(
                    Configuration.GetConnectionString(XdocDbContext.ConnectionString));

            });

            // register it
            services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, AppClaimsPrincipalFactory>();

            services.AddIdentity<ApplicationUser, ApplicationRole>(opts =>
            {
                opts.Password.RequiredLength = 5;
                opts.Password.RequireNonAlphanumeric = false;
                opts.Password.RequireLowercase = false;
                opts.Password.RequireUppercase = false;
                opts.Password.RequireDigit = false;
            }).AddEntityFrameworkStores<XdocDbContext>()
            .AddDefaultTokenProviders();

            SwaggerConfiguration.ConfigureSwagger(services, new List<string>
            {
            });

            services.ConfigureApplicationCookie(options =>
            {
                options.ExpireTimeSpan = TimeSpan.FromDays(5);
                options.Cookie.HttpOnly = true;
                options.SlidingExpiration = true;
                options.LoginPath = "/Account/Login";
                options.LogoutPath = "/Account/Logout";
            });

            services.AddControllersWithViews().AddJsonOptions(options => ConfigureJsonSerializer(options.JsonSerializerOptions));
            services.AddRazorPages();

            services.AddSignalR().AddJsonProtocol(options => {
                ConfigureJsonSerializer(options.PayloadSerializerOptions);
            });

            services.AddHttpContextAccessor();
            services.TryAddSingleton<IActionContextAccessor, ActionContextAccessor>();

            services.AddHangfire(x => x.UseSqlServerStorage(Configuration.GetConnectionString(XdocDbContext.ConnectionString)));

            //Установка приложения
            Croco.SetCrocoApplication(services);
        }

        
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.EnvironmentName == DevelopmentEnvironmentName)
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseDeveloperExceptionPage();
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }


            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });

            app.UseStaticFiles();
            app.UseCookiePolicy();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
                endpoints.MapAreaControllerRoute(
                    "admin",
                    "admin",
                    "Admin/{controller=Home}/{action=Index}/{id?}");

            });

            app.ConfigureExceptionHandler(new ApplicationLoggerManager());

            HangfireConfiguration.AddHangfire(app, env.EnvironmentName == DevelopmentEnvironmentName);
        }
    }
}