(function () {
  if (document.getElementById("authModal")) {
    return;
  }

  const modalWrapper = document.createElement("div");
  modalWrapper.innerHTML = `
    <div class="modal fade" id="authModal" tabindex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="authModalLabel">Login or Sign Up</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h6>Login</h6>
            <input type="email" id="loginEmail" class="form-control mb-2" placeholder="Email" />
            <input type="password" id="loginPassword" class="form-control mb-2" placeholder="Password" />
            <button id="loginBtn" class="btn btn-primary mb-3">Login</button>
            <div id="loginMessage" style="min-height: 1.5em;"></div>

            <hr class="my-4" />

            <h6>Sign Up</h6>
            <input type="text" id="signupUsername" class="form-control mb-2" placeholder="Username" />
            <input type="email" id="signupEmail" class="form-control mb-2" placeholder="Email" />
            <input type="password" id="signupPassword" class="form-control mb-3" placeholder="Password" />

            <div class="form-check mt-3">
              <input class="form-check-input" type="checkbox" id="signupTosCheckbox">
              <label class="form-check-label" for="signupTosCheckbox">
                I have read and agree to the Terms of Service, Privacy Policy, and Disclaimer.
              </label>
            </div>

            <div id="signupMessage" class="mt-3" style="min-height: 1.5em;"></div>
            <button id="signupBtn" class="btn btn-primary mt-3">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalWrapper.firstElementChild);
})();
