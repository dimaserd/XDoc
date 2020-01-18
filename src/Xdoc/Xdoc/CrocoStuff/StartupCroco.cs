﻿using Croco.Core.Abstractions.Application;
using Croco.Core.Application;
using Croco.Core.Application.Options;
using Croco.Core.Common.Enumerations;
using Croco.Core.Extensions.Implementations;
using Croco.Core.Hangfire.Extensions;
using Croco.Core.Logic.Models.Files;
using Croco.WebApplication.Application;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using Xdoc.Implementations;
using Xdoc.Logic.Implementations;
using Xdoc.Model.Contexts;
using Zoo.Core;

namespace Xdoc.CrocoStuff
{
    public class StartupCroco
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Env { get; }

        public List<Action<ICrocoApplication>> ApplicationActions { get; }

        public StartupCroco(StartUpCrocoOptions options)
        {
            Configuration = options.Configuration;
            Env = options.Env;
            ApplicationActions = options.ApplicationActions;
        }

        public void SetCrocoApplication(IServiceCollection services)
        {
            var memCache = new MemoryCache(new MemoryCacheOptions());

            services.AddSingleton<IMemoryCache, MemoryCache>(s => memCache);

            var baseOptions = new EFCrocoApplicationOptions
            {
                CacheManager = new ApplicationCacheManager(memCache),
                GetDbContext = () => XdocDbContext.Create(Configuration),
                RequestContextLogger = new CrocoWebAppRequestContextLogger(),
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
                    },
                },
                RootPath = Env.ContentRootPath,
                AfterInitActions = ApplicationActions
            }.GetApplicationOptions();


            baseOptions.AddDelayedApplicationLogger()
                .AddHangfireEventSourcerAndJobManager();

            var options = new CrocoWebApplicationOptions()
            {
                ApplicationUrl = "https://findtask.ru",
                CrocoOptions = baseOptions,
            };

            var application = new XDocWebApplication(options)
            {
                IsDevelopment = Env.EnvironmentName == "Development"
            };

            CrocoApp.Application = application;

            services.AddSingleton(CrocoApp.Application);
        }
    }
}