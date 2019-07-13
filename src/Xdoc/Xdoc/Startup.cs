using System;
using System.Collections.Generic;
using System.IO;
using Croco.Core.Application;
using Croco.Core.Application.Options;
using Croco.Core.Common.Enumerations;
using Croco.Core.Logic.Models.Files;
using Croco.WebApplication.Application;
using CrocoShop.Implementations;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Swagger;
using Xdoc.Extensions;
using Xdoc.Implementations;
using Xdoc.Logic.Implementations;
using Xdoc.Logic.Services;
using Xdoc.Model.Contexts;
using Xdoc.Model.Entities.Users.Default;

namespace Xdoc
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            Env = env;
        }

        public IConfiguration Configuration { get; }
        public IHostingEnvironment Env { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
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

            SetCrocoApplication(services);
            ConfigureSwagger(services);


            services.AddTransient<ApplicationUserManager>();
            services.AddTransient<ApplicationSignInManager>();

            services.AddDbContext<XdocDbContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString(XdocDbContext.ConnectionString)));


            services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, AppClaimsPrincipalFactory>();

            services.AddIdentity<ApplicationUser, ApplicationRole>(opts =>
            {
                opts.Password.RequiredLength = 5;
                opts.Password.RequireNonAlphanumeric = false;
                opts.Password.RequireLowercase = false;
                opts.Password.RequireUppercase = false;
                opts.Password.RequireDigit = false;
            }).AddEntityFrameworkStores<XdocDbContext>();

            

            services.AddSignalR().AddJsonProtocol(options => {
                options.PayloadSerializerSettings.ContractResolver =
                new DefaultContractResolver();
                options.PayloadSerializerSettings.Converters.Add(new StringEnumConverter());
            });

            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.HttpOnly = true;
                options.Cookie.Expiration = TimeSpan.FromDays(5);
                options.SlidingExpiration = true;
                options.LoginPath = "/Account/Login";
                options.LogoutPath = "/Account/Logout";
            });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                    options.SerializerSettings.Converters.Add(new StringEnumConverter());
                });

            services.AddHttpContextAccessor();
            services.TryAddSingleton<IActionContextAccessor, ActionContextAccessor>();
        }

        private void ConfigureSwagger(IServiceCollection services)
        {
            var xmlDocs = new List<string>
            {
                "Xdoc.Api.xml",
                "Xdoc.Logic.xml"
            };

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info
                {
                    Version = "v1",
                    Title = "ToDo API",
                    Description = "A simple example ASP.NET Core Web API",
                    TermsOfService = "None",
                    Contact = new Contact
                    {
                        Name = "Shayne Boyer",
                        Email = string.Empty,
                        Url = "https://twitter.com/spboyer"
                    },
                    License = new License
                    {
                        Name = "Use under LICX",
                        Url = "https://example.com/license"
                    }
                });
                c.EnableAnnotations();
                xmlDocs.ForEach(x => c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, x)));
            });
        }

        private void SetCrocoApplication(IServiceCollection services)
        {
            var memCache = new MemoryCache(new MemoryCacheOptions());

            services.AddSingleton<IMemoryCache, MemoryCache>(s => memCache);

            var appOptions = new CrocoWebApplicationOptions(new ApplicationServerVirtualPathMapper(Env))
            {
                CacheManager = new ApplicationCacheManager(memCache),
                GetDbContext = () => XdocDbContext.Create(Configuration),
                FileOptions = new CrocoFileOptions
                {
                    SourceDirectory = Env.WebRootPath,
                    ImgFileResizeSettings = new List<ImgFileResizeSetting>
                    {
                        new ImgFileResizeSetting
                        {
                            ImageSizeName = ImageSizeType.Icon.ToString(),
                            MaxHeight = 50,
                            MaxWidth = 50
                        },

                        new ImgFileResizeSetting
                        {
                            ImageSizeName = ImageSizeType.Small.ToString(),
                            MaxHeight = 200,
                            MaxWidth = 200
                        },

                        new ImgFileResizeSetting
                        {
                            ImageSizeName = ImageSizeType.Medium.ToString(),
                            MaxHeight = 500,
                            MaxWidth = 500
                        }
                    }
                }
            };

            var application = new XDocWebApplication(appOptions)
            {
                IsDevelopment = Env.IsDevelopment()
            };

            CrocoApp.Application = application;

            services.AddSingleton(CrocoApp.Application);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
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

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();

            app.UseAuthentication();


            app.ConfigureExceptionHandler(new ApplicationLoggerManager());

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    "areas",
                    "{area:exists}/{controller=Home}/{action=Index}/{id?}");

                routes.MapRoute("default", "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
