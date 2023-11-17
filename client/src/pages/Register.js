import React, { useEffect, useState } from "react";

function Register() {
  return (
    <div class="pt-48">
      <section>
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <div class="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-[#F1D1AB]">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create and account
              </h1>
              <form class="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    for="email"
                    class="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    class="bg-[#F6F6F6] text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    placeholder="name@company.com"
                    required=""
                  />
                </div>
                <div>
                  <label
                    for="password"
                    class="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    class="bg-[#F6F6F6] text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    required=""
                  />
                </div>
                <div>
                  <label
                    for="confirm-password"
                    class="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="confirm-password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    class="bg-[#F6F6F6] text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    required=""
                  />
                </div>
                <button
                  type="submit"
                  class="w-full text-black bg-white hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Create an account
                </button>
                <p class="text-sm font-light text-gray-700">
                  Already have an account?{" "}
                  <a
                    href="/Login"
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;
