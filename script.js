document.addEventListener("DOMContentLoaded", () => {
  // Menú hamburguesa
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  document.querySelectorAll(".nav-menu li a").forEach((n) =>
    n.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    }),
  )

  // Carrito de compras
  let cart = []
  const cartItems = document.getElementById("cart-items")
  const cartSubtotal = document.getElementById("cart-subtotal")
  const cartTax = document.getElementById("cart-tax")
  const cartTotal = document.getElementById("cart-total")
  const cartCount = document.getElementById("cart-count")
  const cartModal = document.getElementById("cart-modal")
  const cartButton = document.getElementById("cart-button")
  const closeButtons = document.querySelectorAll(".close")
  const checkoutBtn = document.getElementById("checkout-btn")
  const continueShoppingBtn = document.getElementById("continue-shopping")

  function updateCart() {
    cartItems.innerHTML = ""
    let subtotal = 0

    if (cart.length === 0) {
      const emptyCartMessage = document.createElement("p")
      emptyCartMessage.textContent = "Tu carrito está vacío"
      emptyCartMessage.style.textAlign = "center"
      emptyCartMessage.style.padding = "2rem 0"
      cartItems.appendChild(emptyCartMessage)
    } else {
      cart.forEach((item, index) => {
        const itemElement = document.createElement("div")
        itemElement.className = "cart-item"

        const itemPrice = item.price * item.quantity
        subtotal += itemPrice

        itemElement.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}">+</button>
                    </div>
                    <div class="cart-item-remove" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </div>
                `

        cartItems.appendChild(itemElement)
      })
    }

    const tax = subtotal * 0.16
    const total = subtotal + tax

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`
    cartTax.textContent = `$${tax.toFixed(2)}`
    cartTotal.textContent = `$${total.toFixed(2)}`
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0)

    // Añadir event listeners a los botones de cantidad y eliminar
    document.querySelectorAll(".quantity-btn.decrease").forEach((button) => {
      button.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        if (cart[index].quantity > 1) {
          cart[index].quantity--
          updateCart()
        }
      })
    })

    document.querySelectorAll(".quantity-btn.increase").forEach((button) => {
      button.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        cart[index].quantity++
        updateCart()
      })
    })

    document.querySelectorAll(".cart-item-remove").forEach((button) => {
      button.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        cart.splice(index, 1)
        updateCart()
      })
    })
  }

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id")
      const name = button.getAttribute("data-name")
      const price = Number.parseFloat(button.getAttribute("data-price"))

      const existingItem = cart.find((item) => item.id === id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        cart.push({ id, name, price, quantity: 1 })
      }

      // Mostrar notificación
      const notification = document.createElement("div")
      notification.className = "notification"
      notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-check-circle"></i>
                    <p>${name} añadido al carrito</p>
                </div>
            `
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.classList.add("show")
      }, 100)

      setTimeout(() => {
        notification.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 3000)

      updateCart()
    })
  })

  cartButton.onclick = () => (cartModal.style.display = "block")
  closeButtons.forEach((button) => {
    button.onclick = function () {
      const modal = this.closest(".modal")
      if (modal) {
        modal.style.display = "none"
      }
    }
  })

  continueShoppingBtn.onclick = () => (cartModal.style.display = "none")

  window.onclick = (event) => {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none"
    }
  }

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("El carrito está vacío")
    } else {
      alert("Gracias por tu compra. Tu pedido ha sido procesado.")
      cart = []
      updateCart()
      cartModal.style.display = "none"
    }
  })

  // Inicializar carrito
  updateCart()

  // Búsqueda y autocompletado
  const searchInput = document.querySelector("#search-input")
  const searchButton = document.querySelector("#search-button")
  const autocompleteList = document.querySelector("#autocomplete-list")

  const products = [
    "Kit de Personalización Premium",
    "Sistema de Sonido Profesional",
    "Set de Rines Deportivos",
    "Kit de Suspensión Deportiva",
    "Sistema de Escape Deportivo",
    "Kit de Frenos de Alto Rendimiento",
    "Wrapping Vinílico",
    "Iluminación LED",
    "Kit de Carrocería",
    "Asientos Deportivos",
    "Volante Deportivo",
    "Sistema de Admisión",
    "Reprogramación ECU",
  ]

  function autocomplete(inp, arr) {
    inp.addEventListener("input", function (e) {
      const val = this.value
      closeAllLists()
      if (!val) {
        return false
      }
      arr.forEach((item) => {
        if (item.toLowerCase().includes(val.toLowerCase())) {
          const div = document.createElement("DIV")
          div.innerHTML = item.replace(new RegExp(val, "gi"), (match) => `<strong>${match}</strong>`)
          div.addEventListener("click", function (e) {
            inp.value = this.textContent
            closeAllLists()
            performSearch()
          })
          autocompleteList.appendChild(div)
        }
      })
    })
  }

  function closeAllLists() {
    autocompleteList.innerHTML = ""
  }

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase()
    const productCards = document.querySelectorAll(".product-card")
    let found = false

    productCards.forEach((card) => {
      const productName = card.querySelector("h3").textContent.toLowerCase()
      if (productName.includes(searchTerm)) {
        card.style.display = "block"
        found = true
      } else {
        card.style.display = "none"
      }
    })

    if (!found && searchTerm !== "") {
      alert("No se encontraron productos que coincidan con la búsqueda.")
    }
    closeAllLists()
  }

  autocomplete(searchInput, products)
  searchButton.addEventListener("click", performSearch)
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch()
    }
  })

  // Filtrado de productos
  const filterButtons = document.querySelectorAll(".category-filter .filter-btn")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter")

      // Actualizar botón activo
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Filtrar productos
      const productCards = document.querySelectorAll(".product-card")

      productCards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    })
  })

  // Filtrado de galería
  const galleryFilterButtons = document.querySelectorAll(".gallery-filter .filter-btn")

  galleryFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter")

      // Actualizar botón activo
      galleryFilterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Filtrar items de galería
      const galleryItems = document.querySelectorAll(".gallery-item")

      galleryItems.forEach((item) => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.style.display = "block"
        } else {
          item.style.display = "none"
        }
      })
    })
  })

  // Modal de galería
  const galleryItems = document.querySelectorAll(".gallery-item")
  const galleryModal = document.getElementById("gallery-modal")
  const galleryModalImg = document.getElementById("gallery-modal-img")
  const galleryCloseButton = document.querySelector("#gallery-modal .close")
  const galleryPrevButton = document.getElementById("gallery-prev")
  const galleryNextButton = document.getElementById("gallery-next")
  let currentGalleryIndex = 0

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      const imgSrc = item.querySelector("img").src
      galleryModalImg.src = imgSrc
      currentGalleryIndex = index
      galleryModal.style.display = "block"
    })
  })

  galleryCloseButton.onclick = () => (galleryModal.style.display = "none")

  galleryPrevButton.addEventListener("click", () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length
    galleryModalImg.src = galleryItems[currentGalleryIndex].querySelector("img").src
  })

  galleryNextButton.addEventListener("click", () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length
    galleryModalImg.src = galleryItems[currentGalleryIndex].querySelector("img").src
  })

  // Slider de testimonios
  const testimonials = document.querySelectorAll(".testimonial")
  const prevTestimonialBtn = document.getElementById("prev-testimonial")
  const nextTestimonialBtn = document.getElementById("next-testimonial")
  let currentTestimonialIndex = 0

  function showTestimonial(index) {
    testimonials.forEach((testimonial) => (testimonial.style.display = "none"))
    testimonials[index].style.display = "block"
  }

  // Mostrar el primer testimonio
  showTestimonial(currentTestimonialIndex)

  prevTestimonialBtn.addEventListener("click", () => {
    currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length
    showTestimonial(currentTestimonialIndex)
  })

  nextTestimonialBtn.addEventListener("click", () => {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length
    showTestimonial(currentTestimonialIndex)
  })

  // Sistema de calificación
  const ratingStars = document.querySelectorAll(".rating-select i")
  const ratingInput = document.getElementById("comment-rating")

  ratingStars.forEach((star) => {
    star.addEventListener("mouseover", function () {
      const rating = this.getAttribute("data-rating")
      updateStars(rating)
    })

    star.addEventListener("mouseout", () => {
      const rating = ratingInput.value
      updateStars(rating)
    })

    star.addEventListener("click", function () {
      const rating = this.getAttribute("data-rating")
      ratingInput.value = rating
      updateStars(rating)
    })
  })

  function updateStars(rating) {
    ratingStars.forEach((star) => {
      const starRating = star.getAttribute("data-rating")
      if (starRating <= rating) {
        star.className = "fas fa-star"
      } else {
        star.className = "far fa-star"
      }
    })
  }

  // Acordeón de FAQ
  const accordionItems = document.querySelectorAll(".accordion-item")

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header")

    header.addEventListener("click", () => {
      // Cerrar todos los items abiertos
      accordionItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active")
        }
      })

      // Alternar el estado del item actual
      item.classList.toggle("active")
    })
  })

  // Manejo de formularios
  document.getElementById("contact-form")?.addEventListener("submit", function (e) {
    e.preventDefault()
    alert("Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.")
    this.reset()
  })

  document.getElementById("comment-form")?.addEventListener("submit", function (e) {
    e.preventDefault()
    const name = document.getElementById("comment-name").value
    const email = document.getElementById("comment-email").value
    const text = document.getElementById("comment-text").value
    const rating = document.getElementById("comment-rating").value

    if (rating === "0") {
      alert("Por favor, selecciona una calificación")
      return
    }

    const newTestimonial = document.createElement("div")
    newTestimonial.className = "testimonial"

    let stars = ""
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '<i class="fas fa-star"></i>'
      } else {
        stars += '<i class="far fa-star"></i>'
      }
    }

    newTestimonial.innerHTML = `
            <div class="testimonial-rating">
                ${stars}
            </div>
            <p>"${text}"</p>
            <div class="testimonial-author">
                <img src="https://ui-avatars.com/api/?name=${name}&background=random" alt="${name}">
                <div>
                    <p class="author-name">${name}</p>
                    <p class="author-car">Cliente verificado</p>
                </div>
            </div>
        `

    const testimonialsContainer = document.querySelector(".testimonials-slider")
    testimonialsContainer.appendChild(newTestimonial)

    // Actualizar el slider de testimonios
    testimonials.forEach((testimonial) => (testimonial.style.display = "none"))
    newTestimonial.style.display = "block"

    alert("Gracias por tu comentario.")
    this.reset()
    ratingInput.value = "0"
    updateStars(0)
  })

  document.getElementById("newsletter-form")?.addEventListener("submit", function (e) {
    e.preventDefault()
    alert("Gracias por suscribirte a nuestro newsletter.")
    this.reset()
  })

  // Animación de scroll suave
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        })
      }
    })
  })

  // Animación de elementos al hacer scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".service-card, .product-card, .gallery-item, .testimonial")

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const screenPosition = window.innerHeight / 1.3

      if (elementPosition < screenPosition) {
        element.classList.add("animate")
      }
    })
  }

  window.addEventListener("scroll", animateOnScroll)

  // Inicializar animaciones
  animateOnScroll()

  // Notificación de cookies
  setTimeout(() => {
    const cookieNotification = document.createElement("div")
    cookieNotification.className = "cookie-notification"
    cookieNotification.innerHTML = `
            <div class="cookie-content">
                <p>Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. <a href="#">Más información</a></p>
                <button id="accept-cookies" class="btn">Aceptar</button>
            </div>
        `
    document.body.appendChild(cookieNotification)

    setTimeout(() => {
      cookieNotification.classList.add("show")
    }, 100)

    document.getElementById("accept-cookies").addEventListener("click", () => {
      cookieNotification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(cookieNotification)
      }, 300)
    })
  }, 2000)

  // Inicializar calendario para citas
  if (typeof flatpickr !== "undefined" && document.getElementById("appointment-date")) {
    flatpickr("#appointment-date", {
      minDate: "today",
      maxDate: new Date().fp_incr(30), // 30 días desde hoy
      dateFormat: "Y-m-d",
      disable: [
        (date) => {
          // Deshabilitar domingos
          return date.getDay() === 0
        },
      ],
      locale: {
        firstDayOfWeek: 1,
        weekdays: {
          shorthand: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
          longhand: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        },
        months: {
          shorthand: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
          longhand: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ],
        },
      },
      onChange: (selectedDates, dateStr, instance) => {
        generateTimeSlots(dateStr)
      },
    })
  }

  // Generar horarios disponibles
  function generateTimeSlots(date) {
    const timeSlotsContainer = document.getElementById("time-slots")
    if (!timeSlotsContainer) return

    timeSlotsContainer.innerHTML = ""

    // Horarios de 9:00 AM a 6:00 PM con intervalos de 1 hora
    const startHour = 9
    const endHour = 18

    // Generar horarios aleatorios disponibles
    for (let hour = startHour; hour < endHour; hour++) {
      const timeSlot = document.createElement("div")
      timeSlot.className = "time-slot"

      // Formato de 12 horas
      const displayHour = hour > 12 ? hour - 12 : hour
      const amPm = hour >= 12 ? "PM" : "AM"

      timeSlot.textContent = `${displayHour}:00 ${amPm}`

      // Aleatoriamente marcar algunos horarios como no disponibles
      if (Math.random() > 0.7) {
        timeSlot.classList.add("disabled")
        timeSlot.textContent += " (No disponible)"
      } else {
        timeSlot.addEventListener("click", function () {
          document.querySelectorAll(".time-slot").forEach((slot) => {
            slot.classList.remove("selected")
          })
          this.classList.add("selected")
        })
      }

      timeSlotsContainer.appendChild(timeSlot)
    }
  }

  // Manejar envío de formulario de cita
  const submitAppointmentBtn = document.getElementById("submit-appointment")
  if (submitAppointmentBtn) {
    submitAppointmentBtn.addEventListener("click", () => {
      const name = document.getElementById("appointment-name")?.value
      const date = document.getElementById("appointment-date")?.value
      const selectedTimeSlot = document.querySelector(".time-slot.selected")

      if (!name || !date || !selectedTimeSlot) {
        alert("Por favor, completa todos los campos y selecciona un horario disponible.")
        return
      }

      alert(`¡Cita reservada con éxito! Te esperamos el ${date} a las ${selectedTimeSlot.textContent}.`)
      document.getElementById("appointment-form").reset()
      document.querySelectorAll(".time-slot").forEach((slot) => {
        slot.classList.remove("selected")
      })
    })
  }

  // Calculadora de presupuesto
  const calculateBudgetBtn = document.getElementById("calculate-budget")
  if (calculateBudgetBtn) {
    calculateBudgetBtn.addEventListener("click", () => {
      const vehicleType = document.getElementById("vehicle-type").value
      if (!vehicleType) {
        alert("Por favor, selecciona un tipo de vehículo.")
        return
      }

      let basePrice = 0
      switch (vehicleType) {
        case "sedan":
          basePrice = 500
          break
        case "suv":
          basePrice = 700
          break
        case "pickup":
          basePrice = 800
          break
        case "deportivo":
          basePrice = 1000
          break
        case "clasico":
          basePrice = 1200
          break
        default:
          basePrice = 600
      }

      let totalPrice = basePrice
      const selectedServices = []

      document.querySelectorAll('.calculator-option input[type="checkbox"]:checked').forEach((checkbox) => {
        const price = Number.parseFloat(checkbox.getAttribute("data-price"))
        const serviceName = checkbox.nextElementSibling.textContent
        totalPrice += price
        selectedServices.push({ name: serviceName, price })
      })

      const calculatorResult = document.getElementById("calculator-result")
      const calculatorPrice = document.getElementById("calculator-price")
      const calculatorDetails = document.getElementById("calculator-details")

      calculatorPrice.textContent = `$${totalPrice.toFixed(2)}`
      calculatorDetails.innerHTML = ""

      // Añadir precio base
      const baseDetail = document.createElement("div")
      baseDetail.className = "calculator-detail"
      baseDetail.innerHTML = `
                <span>Precio base (${vehicleType})</span>
                <span>$${basePrice.toFixed(2)}</span>
            `
      calculatorDetails.appendChild(baseDetail)

      // Añadir servicios seleccionados
      selectedServices.forEach((service) => {
        const serviceDetail = document.createElement("div")
        serviceDetail.className = "calculator-detail"
        serviceDetail.innerHTML = `
                    <span>${service.name}</span>
                    <span>$${service.price.toFixed(2)}</span>
                `
        calculatorDetails.appendChild(serviceDetail)
      })

      calculatorResult.style.display = "block"
    })
  }

  // Visualizador 3D
  const product3dModal = document.getElementById("product-3d-modal")
  const product3dTitle = document.getElementById("product-3d-title")
  const product3dCanvas = document.getElementById("product-3d-canvas")

  document.querySelectorAll(".view-3d-button").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const productId = this.getAttribute("data-product")
      const productName = this.closest(".product-card").querySelector("h3").textContent

      product3dTitle.textContent = `Visualizador 3D - ${productName}`
      product3dModal.style.display = "block"

      // Inicializar Three.js
      initThreeJS(productId)
    })
  })

  // Inicializar Three.js para visualizador 3D
  function initThreeJS(productId) {
    if (!window.THREE) return

    // Limpiar canvas anterior
    while (product3dCanvas.firstChild) {
      product3dCanvas.removeChild(product3dCanvas.firstChild)
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)

    const camera = new THREE.PerspectiveCamera(
      75,
      product3dCanvas.clientWidth / product3dCanvas.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: product3dCanvas })
    renderer.setSize(product3dCanvas.clientWidth, product3dCanvas.clientHeight)

    // Añadir luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(0, 1, 1)
    scene.add(directionalLight)

    // Crear geometría según el producto
    let geometry
    let material

    switch (productId) {
      case "kit-personalizacion":
        geometry = new THREE.BoxGeometry(2, 1, 3)
        material = new THREE.MeshPhongMaterial({ color: 0x4caf50 })
        break
      case "sistema-sonido":
        geometry = new THREE.CylinderGeometry(1, 1, 0.5, 32)
        material = new THREE.MeshPhongMaterial({ color: 0x2196f3 })
        break
      case "rines-deportivos":
        geometry = new THREE.TorusGeometry(1, 0.3, 16, 100)
        material = new THREE.MeshPhongMaterial({ color: 0xe0e0e0, metalness: 0.8 })
        break
      case "suspension-deportiva":
        geometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 32)
        material = new THREE.MeshPhongMaterial({ color: 0xffd700 })
        break
      case "escape-deportivo":
        geometry = new THREE.CylinderGeometry(0.5, 0.7, 2, 32)
        material = new THREE.MeshPhongMaterial({ color: 0xc0c0c0, metalness: 0.9 })
        break
      case "frenos-alto-rendimiento":
        geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32)
        material = new THREE.MeshPhongMaterial({ color: 0xff5252 })
        break
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1)
        material = new THREE.MeshPhongMaterial({ color: 0x4caf50 })
    }

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Animación
    function animate() {
      requestAnimationFrame(animate)
      mesh.rotation.x += 0.01
      mesh.rotation.y += 0.01
      renderer.render(scene, camera)
    }

    animate()

    // Controles de rotación
    document.getElementById("rotate-left")?.addEventListener("click", () => {
      mesh.rotation.y -= 0.5
    })

    document.getElementById("rotate-right")?.addEventListener("click", () => {
      mesh.rotation.y += 0.5
    })

    // Botón de realidad aumentada
    document.getElementById("view-ar")?.addEventListener("click", () => {
      product3dModal.style.display = "none"
      document.getElementById("ar-modal").style.display = "block"
      initAR()
    })
  }

  // Inicializar realidad aumentada
  function initAR() {
    const video = document.getElementById("ar-video")
    const arOverlay = document.getElementById("ar-overlay")

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          video.srcObject = stream
        })
        .catch((error) => {
          console.error("Error al acceder a la cámara:", error)
          alert("No se pudo acceder a la cámara. Por favor, verifica los permisos.")
        })
    } else {
      alert("Tu navegador no soporta acceso a la cámara.")
    }

    // Simular colocación de objeto 3D
    let objectPlaced = false
    let objectScale = 1
    let objectRotation = 0

    video.addEventListener("click", (e) => {
      if (!objectPlaced) {
        const rect = video.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const object = document.createElement("div")
        object.style.position = "absolute"
        object.style.left = `${x - 50}px`
        object.style.top = `${y - 50}px`
        object.style.width = "100px"
        object.style.height = "100px"
        object.style.backgroundColor = "rgba(76, 175, 80, 0.5)"
        object.style.borderRadius = "50%"
        object.style.transform = `scale(${objectScale}) rotate(${objectRotation}deg)`
        object.style.transition = "transform 0.3s ease"
        object.id = "ar-object"

        arOverlay.appendChild(object)
        objectPlaced = true
      }
    })

    // Controles de AR
    document.getElementById("ar-rotate")?.addEventListener("click", () => {
      const object = document.getElementById("ar-object")
      if (object) {
        objectRotation += 45
        object.style.transform = `scale(${objectScale}) rotate(${objectRotation}deg)`
      }
    })

    document.getElementById("ar-scale-up")?.addEventListener("click", () => {
      const object = document.getElementById("ar-object")
      if (object) {
        objectScale += 0.1
        object.style.transform = `scale(${objectScale}) rotate(${objectRotation}deg)`
      }
    })

    document.getElementById("ar-scale-down")?.addEventListener("click", () => {
      const object = document.getElementById("ar-object")
      if (object && objectScale > 0.2) {
        objectScale -= 0.1
        object.style.transform = `scale(${objectScale}) rotate(${objectRotation}deg)`
      }
    })
  }

  // Chat de voz en vivo
  const voiceChatButton = document.getElementById("voice-chat-button")
  const voiceChatModal = document.getElementById("voice-chat-modal")
  const voiceChatClose = document.getElementById("voice-chat-close")
  const voiceRecordButton = document.getElementById("voice-record-button")
  const voiceStatus = document.getElementById("voice-status")
  const voiceChatMessages = document.getElementById("voice-chat-messages")

  let recognition
  let isRecording = false

  if (voiceChatButton) {
    voiceChatButton.addEventListener("click", () => {
      voiceChatModal.style.display = "block"
    })
  }

  if (voiceChatClose) {
    voiceChatClose.addEventListener("click", () => {
      voiceChatModal.style.display = "none"
      if (isRecording && recognition) {
        recognition.stop()
        isRecording = false
        voiceStatus.textContent = "Presiona para hablar"
        voiceRecordButton.innerHTML = '<i class="fas fa-microphone"></i>'
      }
    })
  }

  if (voiceRecordButton) {
    voiceRecordButton.addEventListener("click", () => {
      if (!isRecording) {
        startVoiceRecognition()
      } else {
        stopVoiceRecognition()
      }
    })
  }

  if (voiceRecordButton) {
    voiceRecordButton.addEventListener("click", () => {
      if (!isRecording) {
        startVoiceRecognition()
      } else {
        stopVoiceRecognition()
      }
    })
  }

  function startVoiceRecognition() {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      recognition.lang = "es-ES"
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        isRecording = true
        voiceStatus.textContent = "Escuchando..."
        voiceRecordButton.innerHTML = '<i class="fas fa-stop"></i>'
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        addUserVoiceMessage(transcript)
        processVoiceCommand(transcript)
      }

      recognition.onerror = (event) => {
        console.error("Error en reconocimiento de voz:", event.error)
        voiceStatus.textContent = "Error. Intenta de nuevo."
        isRecording = false
        voiceRecordButton.innerHTML = '<i class="fas fa-microphone"></i>'
      }

      recognition.onend = () => {
        isRecording = false
        voiceStatus.textContent = "Presiona para hablar"
        voiceRecordButton.innerHTML = '<i class="fas fa-microphone"></i>'
      }

      recognition.start()
    } else {
      voiceStatus.textContent = "Tu navegador no soporta reconocimiento de voz."
      alert("Tu navegador no soporta reconocimiento de voz.")
    }
  }

  function stopVoiceRecognition() {
    if (recognition) {
      recognition.stop()
    }
  }

  function addUserVoiceMessage(text) {
    const messageElement = document.createElement("div")
    messageElement.className = "voice-message user"
    messageElement.innerHTML = `<p>${text}</p>`
    voiceChatMessages.appendChild(messageElement)
    voiceChatMessages.scrollTop = voiceChatMessages.scrollHeight
  }

  function addAssistantVoiceMessage(text) {
    const messageElement = document.createElement("div")
    messageElement.className = "voice-message assistant"
    messageElement.innerHTML = `<p>${text}</p>`
    voiceChatMessages.appendChild(messageElement)
    voiceChatMessages.scrollTop = voiceChatMessages.scrollHeight

    // Leer respuesta en voz alta
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "es-ES"
      window.speechSynthesis.speak(utterance)
    }
  }

  function processVoiceCommand(command) {
    command = command.toLowerCase()

    setTimeout(() => {
      if (
        command.includes("hola") ||
        command.includes("buenos días") ||
        command.includes("buenas tardes") ||
        command.includes("buenas noches")
      ) {
        addAssistantVoiceMessage("¡Hola! ¿En qué puedo ayudarte hoy?")
      } else if (command.includes("reservar") || command.includes("cita")) {
        addAssistantVoiceMessage(
          'Para reservar una cita, puedes usar nuestro sistema de reservas en la sección "Reservar Cita" o llamarnos al +52 55 1234 5678.',
        )
      } else if (command.includes("horario") || command.includes("horarios")) {
        addAssistantVoiceMessage(
          "Nuestro horario es de lunes a viernes de 9:00 AM a 7:00 PM y sábados de 10:00 AM a 3:00 PM.",
        )
      } else if (command.includes("ubicación") || command.includes("dirección") || command.includes("donde están")) {
        addAssistantVoiceMessage("Estamos ubicados en Av. Principal #123, Zona Industrial, Ciudad de México.")
      } else if (command.includes("precio") || command.includes("costo") || command.includes("cuánto cuesta")) {
        addAssistantVoiceMessage(
          "Los precios varían según el servicio. Puedes consultar nuestros precios en la sección de servicios o productos, o usar nuestra calculadora de presupuesto para obtener un estimado.",
        )
      } else if (command.includes("contacto") || command.includes("teléfono") || command.includes("email")) {
        addAssistantVoiceMessage("Puedes contactarnos al +52 55 1234 5678 o por email a info@charlieskustoms.com.")
      } else if (command.includes("gracias")) {
        addAssistantVoiceMessage("¡De nada! Estamos para servirte. ¿Hay algo más en lo que pueda ayudarte?")
      } else if (command.includes("adiós") || command.includes("hasta luego") || command.includes("chao")) {
        addAssistantVoiceMessage(
          "¡Hasta luego! Gracias por contactar con Charlie's Kustoms. ¡Que tengas un excelente día!",
        )
      } else {
        addAssistantVoiceMessage("Lo siento, no entendí tu consulta. ¿Podrías reformularla o ser más específico?")
      }
    }, 1000)
  }
})
