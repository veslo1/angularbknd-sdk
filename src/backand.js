'use strict';

angular.module('backand', [])
    .provider('Backand', function () {

        // Provider functions (should be called on module config block)
        this.getApiUrl = function () {
            return config.apiUrl;
        };

        this.setApiUrl = function (newApiUrl) {
            config.apiUrl = newApiUrl;
            return this;
        };

        this.getTokenName = function (newTokenName) {
            return config.tokenName;
        };

        this.setTokenName = function (newTokenName) {
            config.tokenName = newTokenName;
            return this;
        };

        this.setAnonymousToken = function (anonymousToken) {
            config.anonymousToken = anonymousToken;
            return this;
        };

        this.setSignUpToken = function (signUpToken) {
            config.signUpToken = signUpToken;
            return this;
        };

        this.setAppName = function (appName) {
            config.appName = appName;
            return this;
        };

        // deprecated
        this.manageDefaultHeaders = function (isManagingDefaultHeaders) {
            return this;
        };

        this.manageHttpInterceptor = function (isManagingHttpInterceptor) {
            config.isManagingHttpInterceptor = isManagingHttpInterceptor == undefined ? true : isManagingHttpInterceptor;
            return this;
        };

        this.manageRefreshToken = function (isManagingRefreshToken) {
            config.isManagingRefreshToken = isManagingRefreshToken == undefined ? true : isManagingRefreshToken;
            return this;
        };

        this.runSigninAfterSignup = function (runSigninAfterSignup) {
            config.runSigninAfterSignup = runSigninAfterSignup == undefined ? true : runSigninAfterSignup;
            return this;
        };

        // $get returns the service
        this.$get = ['BackandAuthService', 'BackandUserService', function (BackandAuthService, BackandUserService) {
            return new BackandService(BackandAuthService, BackandUserService);
        }];

        // Backand Service
        function BackandService(BackandAuthService, BackandUserService) {
            var self = this;

            self.EVENTS = EVENTS;

            self.setAppName = function (appName) {
                config.appName = appName;
            };

            self.signin = function (username, password) {
                return BackandAuthService.signin(username, password)
            };

            self.signout = function () {
                return BackandAuthService.signout();
            };

            self.signup = function (firstName, lastName, email, password, confirmPassword, parameters) {
                return BackandAuthService.signup(firstName, lastName, email, password, confirmPassword, parameters);
            };

            self.getSocialProviders = function () {
                return socialProviders;
            };

            self.socialSignin = function (provider, spec) {
                return BackandAuthService.socialSignin(provider, spec)
            };

            self.socialSignup = function (provider, parameters, spec) {
                return BackandAuthService.socialSignup(provider, parameters, spec)
            };

            self.requestResetPassword = function (email) {
                return BackandAuthService.requestResetPassword(email);
            };

            self.resetPassword = function (newPassword, resetToken) {
                return BackandAuthService.resetPassword(newPassword, resetToken);
            };

            self.changePassword = function (oldPassword, newPassword) {
                return BackandAuthService.changePassword(oldPassword, newPassword)
            };


            self.getUserDetails = function (force) {
                return BackandUserService.getUserDetails(force)
            };

            self.getUsername = function () {
                return BackandUserService.getUsername();
            };

            self.getUserRole = function () {
                return BackandUserService.getUserRole();
            };

            self.getToken = function () {
                return BKStorage.token.get();
            };

            self.getTokenName = function () {
                return config.tokenName;
            };

            self.getApiUrl = function () {
                return config.apiUrl;
            };

            // deprecated
            self.isManagingDefaultHeaders = function () {
                return null;
            };

            self.isManagingHttpInterceptor = function () {
                return config.isManagingHttpInterceptor;
            };

            self.isManagingRefreshToken = function () {
                return config.isManagingRefreshToken && BKStorage.user.get() && BKStorage.user.get().refresh_token;
            };

            // backward compatibility
            self.socialSignIn = self.socialSignin;
            self.socialSignUp = self.socialSignup;
        }
    })
    .run(['$injector', function ($injector) {
        $injector.invoke(['$http', function ($http) {
            // Cannot inject http to provider, so doing it here:
            http = $http;
        }]);
    }]);
