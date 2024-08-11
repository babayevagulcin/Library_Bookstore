document
  .querySelector(".contact_form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const fullname = document.querySelector("#contactFullName").value;
    const email = document.querySelector("#contactEmail").value;
    const address = document.querySelector("#contactAdress").value;
    const phone = document.querySelector("#contactPhone").value;
    const note = document.querySelector("#note").value;

    const contactData = {
      fullname,
      email,
      address,
      phone,
      note,
    };

    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts.push(contactData);
    localStorage.setItem("contacts", JSON.stringify(contacts));

    document.querySelector(".contact_form").reset();
  });
