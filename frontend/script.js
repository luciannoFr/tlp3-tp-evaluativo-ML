      // Animaciones y interacciones
      document.addEventListener("DOMContentLoaded", function () {
        // Intersection Observer para animaciones
        const observerOptions = {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = "1";
              entry.target.style.transform =
                "translateY(0) translateX(0) scale(1)";
            }
          });
        }, observerOptions);

        // Observar elementos animados
        document
          .querySelectorAll('[class*="animate"], .glass-card, .chart-card')
          .forEach((el) => {
            el.style.opacity = "0";
            observer.observe(el);
          });
      });

      function toggleTheme() {
        document.body.classList.toggle("dark");
        const btn = document.querySelector(".theme-toggle");
        btn.textContent = document.body.classList.contains("dark")
          ? "☀️"
          : "🌙";

        // Guardar preferencia (aunque no podemos usar localStorage)
        const isDark = document.body.classList.contains("dark");
        document.documentElement.style.setProperty(
          "--theme-preference",
          isDark ? "dark" : "light"
        );
      }

      // Predicción con animaciones mejoradas
      document
        .getElementById("predictionForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();

          // Animación de carga mejorada
          const resultArea = document.getElementById("resultArea");
          resultArea.innerHTML = `
    <div class="wine-icon-large" style="animation: pulse 1s ease-in-out infinite; color: var(--secondary-gold);">⏳</div>
    <div class="result-text" style="color: var(--primary-burgundy);">Analizando perfil del vino...</div>
    <div class="confidence-text" style="opacity: 0.7;">Procesando datos con modelo entrenado</div>
  `;

          const formData = new FormData(e.target);
          const data = {
            price: parseFloat(formData.get("price")),
            num_reviews: parseInt(formData.get("num_reviews")),
            body: parseFloat(formData.get("body")),
            acidity: parseFloat(formData.get("acidity")),
          };

          try {
            const response = await fetch("http://localhost:5000/api/predict", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });

            const result = await response.json();

            // Animación de resultado con delay
            setTimeout(() => {
              if (response.ok) {
                const isPremium = result.result
                  .toLowerCase()
                  .includes("premium");
                const icon = isPremium ? "🏆" : "🍷";
                const resultClass = isPremium
                  ? "premium-result"
                  : "common-result";
                const bgGradient = isPremium
                  ? "linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(128, 0, 32, 0.1) 100%)"
                  : "linear-gradient(135deg, rgba(196, 30, 58, 0.1) 0%, rgba(128, 0, 32, 0.05) 100%)";

                resultArea.className = "result-area has-result";
                resultArea.style.background = bgGradient;
                resultArea.innerHTML = `
          <div class="wine-icon-large" style="animation: float 3s ease-in-out infinite; color: ${
            isPremium ? "var(--secondary-gold)" : "var(--wine-red)"
          };">${icon}</div>
          <div class="result-text ${resultClass}" style="font-size: 1.8rem; margin-bottom: 1rem;">
            ${result.result}
          </div>
          <div class="confidence-text" style="font-size: 1.3rem; margin-bottom: 2rem; color: var(--medium-gray);">
            Confianza: ${result.confidence}
          </div>
          <div class="result-description">
            <div style="font-size: 1.1rem; margin-bottom: 1rem;">
              ${
                isPremium
                  ? "🌟 <strong>Clasificación Premium</strong>"
                  : "👍 <strong>Clasificación Común</strong>"
              }
            </div>
            <div style="font-size: 0.95rem; line-height: 1.5; opacity: 0.9;">
              ${
                isPremium
                  ? "Este vino presenta características excepcionales que lo posicionan en el segmento premium del mercado. Ideal para ocasiones especiales y coleccionistas exigentes."
                  : "Un vino con características sólidas y confiables, perfecto para el disfrute cotidiano y momentos casuales. Excelente relación calidad-precio."
              }
            </div>
          </div>
        `;

                // Efecto de celebración para vinos premium
                if (isPremium) {
                }
              } else {
                resultArea.innerHTML = `
          <div class="wine-icon-large" style="color: #dc3545;">❌</div>
          <div class="result-text" style="color: #dc3545; font-size: 1.5rem;">
            Error en la predicción
          </div>
          <div class="confidence-text" style="color: var(--medium-gray);">
            ${result.error || "Error desconocido"}
          </div>
          <div class="result-description">
            <small>Por favor, verifica los datos ingresados e intenta nuevamente.</small>
          </div>
        `;
              }
            }, 2000);
          } catch (error) {
            setTimeout(() => {
              resultArea.innerHTML = `
        <div class="wine-icon-large" style="color: #fd7e14;">⚠️</div>
        <div class="result-text" style="color: #fd7e14; font-size: 1.5rem;">
          Error de Conexión
        </div>
        <div class="confidence-text" style="color: var(--medium-gray);">
          No se pudo conectar con el servidor de predicciones
        </div>
        <div class="result-description">
          <small>Verifica que el servidor esté ejecutándose en el puerto 5000</small>
        </div>
      `;
            }, 2000);
          }
        });

      // Efectos de hover mejorados para las tarjetas
      document.querySelectorAll(".chart-card").forEach((card) => {
        card.addEventListener("mouseenter", function () {
          this.style.transform = "translateY(-12px) scale(1.02)";
          this.style.transition =
            "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        });

        card.addEventListener("mouseleave", function () {
          this.style.transform = "translateY(0) scale(1)";
        });
      });

      // Efecto parallax suave para el header
      window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector(".header");
        if (header) {
          header.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
      });

      // Validación mejorada del formulario
      document.querySelectorAll("#predictionForm input").forEach((input) => {
        input.addEventListener("input", function () {
          const value = parseFloat(this.value);
          const name = this.name;

          // Validaciones específicas
          if (name === "price" && value < 0) {
            this.setCustomValidity("El precio debe ser positivo");
          } else if (name === "num_reviews" && value < 0) {
            this.setCustomValidity("El número de reseñas debe ser positivo");
          } else if (name === "acidity" && (value < 0 || value > 10)) {
            this.setCustomValidity("La acidez debe estar entre 0 y 10");
          } else if (name === "body" && (value < 0 || value > 8)) {
            this.setCustomValidity("El cuerpo debe estar entre 0 y 8");
          } else {
            this.setCustomValidity("");
          }
        });

        // Efecto visual de validación
        input.addEventListener("blur", function () {
          if (this.checkValidity()) {
            this.style.borderColor = "var(--success-green)";
            this.style.boxShadow = "0 0 0 3px rgba(40, 167, 69, 0.1)";
          } else {
            this.style.borderColor = "#dc3545";
            this.style.boxShadow = "0 0 0 3px rgba(220, 53, 69, 0.1)";
          }
        });
      });

      // Función para resetear el área de resultados
      function resetResultArea() {
        const resultArea = document.getElementById("resultArea");
        resultArea.className = "result-area";
        resultArea.style.background = "";
        resultArea.innerHTML = `
    <div class="wine-icon-large">🍷</div>
    <div class="result-text" style="opacity: 0.6; font-size: 1.2rem;">
      Introduce las características del vino para revelar su categoría
    </div>
  `;
      }

      // Event listener para limpiar resultados cuando se modifica el formulario
      document
        .getElementById("predictionForm")
        .addEventListener("input", resetResultArea);
