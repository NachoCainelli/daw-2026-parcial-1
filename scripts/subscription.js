const form = document.querySelector("#subscription-form");
const title = document.querySelector("#subscription-title");

const fields = {
  fullName: document.querySelector("#fullName"),
  email: document.querySelector("#email"),
  password: document.querySelector("#password"),
  confirmPassword: document.querySelector("#confirmPassword"),
  age: document.querySelector("#age"),
  phone: document.querySelector("#phone"),
  address: document.querySelector("#address"),
  city: document.querySelector("#city"),
  postalCode: document.querySelector("#postalCode"),
  dni: document.querySelector("#dni"),
};

const labels = {
  fullName: "Nombre completo",
  email: "Email",
  password: "Contrasena",
  confirmPassword: "Repetir contrasena",
  age: "Edad",
  phone: "Telefono",
  address: "Direccion",
  city: "Ciudad",
  postalCode: "Codigo postal",
  dni: "DNI",
};

const validators = {
  fullName(value) {
    const cleanValue = value.trim();
    const letterCount = (cleanValue.match(/\p{L}/gu) || []).length;

    if (letterCount <= 6 || !/\S+\s+\S+/.test(cleanValue)) {
      return "Debe tener mas de 6 letras y al menos un espacio entre medio.";
    }

    return "";
  },
  email(value) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return "Debe ingresar un email valido.";
    }

    return "";
  },
  password(value) {
    if (!/^[A-Za-z0-9]{8,}$/.test(value) || !/[A-Za-z]/.test(value) || !/\d/.test(value)) {
      return "Debe tener al menos 8 caracteres, con letras y numeros.";
    }

    return "";
  },
  confirmPassword(value) {
    if (!value) {
      return "Debe repetir la contrasena.";
    }

    if (value !== fields.password.value) {
      return "Las contrasenas deben coincidir.";
    }

    return "";
  },
  age(value) {
    if (!/^\d+$/.test(value.trim()) || Number(value) < 18) {
      return "Debe ser un numero entero mayor o igual a 18.";
    }

    return "";
  },
  phone(value) {
    if (!/^\d{7,}$/.test(value.trim())) {
      return "Debe tener al menos 7 digitos, sin espacios, guiones ni parentesis.";
    }

    return "";
  },
  address(value) {
    const cleanValue = value.trim();

    if (
      cleanValue.length < 5 ||
      !/\p{L}/u.test(cleanValue) ||
      !/\d/.test(cleanValue) ||
      !/\S+\s+\S+/.test(cleanValue)
    ) {
      return "Debe tener al menos 5 caracteres, letras, numeros y un espacio en el medio.";
    }

    return "";
  },
  city(value) {
    if (value.trim().length < 3) {
      return "Debe tener al menos 3 caracteres.";
    }

    return "";
  },
  postalCode(value) {
    if (value.trim().length < 3) {
      return "Debe tener al menos 3 caracteres.";
    }

    return "";
  },
  dni(value) {
    if (!/^\d{7,8}$/.test(value.trim())) {
      return "Debe ser un numero de 7 u 8 digitos.";
    }

    return "";
  },
};

function getErrorElement(fieldName) {
  return document.querySelector(`#${fieldName}-error`);
}

function showError(fieldName, message) {
  const field = fields[fieldName];
  const errorElement = getErrorElement(fieldName);

  field.classList.add("is-invalid");
  field.setAttribute("aria-invalid", "true");
  errorElement.textContent = message;
}

function clearError(fieldName) {
  const field = fields[fieldName];
  const errorElement = getErrorElement(fieldName);

  field.classList.remove("is-invalid");
  field.removeAttribute("aria-invalid");
  errorElement.textContent = "";
}

function validateField(fieldName) {
  const message = validators[fieldName](fields[fieldName].value);

  if (message) {
    showError(fieldName, message);
  } else {
    clearError(fieldName);
  }

  return message;
}

function updateTitle() {
  const fullName = fields.fullName.value.trim();
  title.textContent = fullName ? `HOLA ${fullName.toUpperCase()}` : "HOLA";
}

function buildSubmittedData() {
  return Object.entries(fields).map(([fieldName, field]) => {
    return `${labels[fieldName]}: ${field.value.trim()}`;
  });
}

Object.keys(fields).forEach((fieldName) => {
  fields[fieldName].addEventListener("blur", () => validateField(fieldName));
  fields[fieldName].addEventListener("focus", () => clearError(fieldName));
});

fields.fullName.addEventListener("focus", updateTitle);
fields.fullName.addEventListener("keydown", () => {
  setTimeout(updateTitle, 0);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const errors = Object.keys(fields)
    .map((fieldName) => {
      return {
        fieldName,
        message: validateField(fieldName),
      };
    })
    .filter((error) => error.message);

  if (errors.length) {
    const errorMessages = errors.map((error) => `${labels[error.fieldName]}: ${error.message}`);
    alert(`Se encontraron errores:\n\n${errorMessages.join("\n")}`);
    return;
  }

  alert(`Datos cargados correctamente:\n\n${buildSubmittedData().join("\n")}`);
});
