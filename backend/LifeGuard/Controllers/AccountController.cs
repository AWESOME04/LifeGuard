﻿using Application.Contracts;
using Application.Models.ApiResult;
using Application.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Identity.Features.ResendOTP;
using Identity.Features.VerifyOTP;

namespace LifeGuard_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly IAuthService _authService;
        private readonly IMediator mediator;
        public AccountController(IAuthService authService, IMediator mediator)
        {
            _authService = authService;
            this.mediator = mediator;

        }


        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(AuthRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(await _authService.Login(request));
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegistrationResponse>> Register(RegistrationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value.Errors.Count > 0)
                        .ToDictionary(
                            kvp => kvp.Key,
                            kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                        );
                    return BadRequest(new { message = "Invalid model state", errors });
                }

                // Log the request
                Console.WriteLine($"Registration request - Email: {request.Email}, Name: {request.Name}");

                try
                {
                    var result = await _authService.Register(request);
                    return Ok(result);
                }
                catch (Exception serviceEx)
                {
                    // Log service-level exception
                    Console.WriteLine($"Service error: {serviceEx.Message}");
                    return StatusCode(500, new
                    {
                        success = false,
                        message = "Registration failed",
                        error = serviceEx.Message
                    });
                }
            }
            catch (Exception ex)
            {
                // Log controller-level exception
                Console.WriteLine($"Controller error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                
                return StatusCode(500, new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    error = "Please try again later"
                });
            }
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _authService.ForgotPasswordAsync(request);

                return result.IsSuccess ? Ok(result) : StatusCode((int)result.StatusCode, result);
            }
            catch (Exception e)
            {
                var result = new Result(false, ResultStatusCode.BadRequest, e.Message);
                return StatusCode((int)result.StatusCode, result);
            }
        }

        [HttpPost("ResendOTP")]
        public async Task<ActionResult<Result>> ResendOTP(ResendOTPCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await mediator.Send(command);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else
            {
                return StatusCode((int)result.StatusCode, result);
            }

        }

        [HttpPost("VerifyOTP")]
        public async Task<IActionResult> VerifyOTP(VerifyOTPCommand command)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await mediator.Send(command);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            else
            {
                return StatusCode((int)result.StatusCode, result);
            }
        }


        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.ResetPasswordAsync(request);
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            return StatusCode((int)result.StatusCode, result);
        }
    }
}
