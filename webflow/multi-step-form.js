var Webflow = Webflow || [];
Webflow.push(function() {
 var l = $('[multi-step-form-wrapper] .w-slider-arrow-left');
 var r = $('[multi-step-form-wrapper] .w-slider-arrow-right');
 $('[multi-step-form-wrapper]')
   .on('click', '.slider-left', function() {
     l.trigger('tap');
   })
   .on('click', '.slider-right', function() {
     r.trigger('tap');
   });
});

if (typeof $.fn.ionRangeSlider === 'function') {
  $("#range_price").ionRangeSlider({
      grid: true,
      min: 10000,
      max: 100000,
      from: 2500,
      prefix: "S$ ",
      postfix: "+",
      hide_min_max: true,
      decorate_both: true,
      force_edges: true,
      step: 50
  });

  $("#range_date").ionRangeSlider({
      grid: true,
      min: 0,
      max: 12,
      from_min: 0.5,
      from: 1,
      prefix: "M",
      postfix: " month(s)",
      hide_min_max: true,
      force_edges: true,
      step: 0.5
  });
}


const checkboxSingleChoice = () => {
  const checkboxWrappers = document.querySelectorAll(
    "[checkbox-single-choice]"
  );

  checkboxWrappers.forEach((checkboxWrapper) => {
    const checkboxes = checkboxWrapper.querySelectorAll(
      "input[type=checkbox]"
    );

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const checkedCheckboxes = checkboxWrapper.querySelectorAll(
          "input[type=checkbox]:checked"
        );

        if (checkedCheckboxes.length > 1) {
          checkbox.checked = false;
          checkbox.dispatchEvent(new Event("change"));
        }

        const remainingCheckboxes = checkboxWrapper.querySelectorAll(
          "input[type=checkbox]:not(:checked)"
        );

        if (checkedCheckboxes.length === 1) {
          remainingCheckboxes.forEach((remainingCheckbox) => {
            remainingCheckbox.closest("label").style.opacity = "0.5";
            remainingCheckbox.closest("label").style.pointerEvents = "none";
          });
        } else {
          checkboxWrapper.querySelectorAll("label").forEach((label) => {
            label.style.opacity = "";
            label.style.pointerEvents = "";
          });
        }
      });
    });
  });
};

checkboxSingleChoice();

const formSliderValidationLogic = () => {
  document.querySelectorAll("[form-slider]").forEach((slider) => {
    const requiredFields = slider.querySelectorAll("[required]");
    const nextButton = slider.querySelector('[form-button-type="next"]');
    const checkboxes = slider.querySelectorAll('[type="checkbox"]:not([optional-input])');
    const radios = slider.querySelectorAll('[type="radio"]:not([optional-input])');

    function validateForm() {
      const areFieldsEmpty = Array.from(requiredFields).some((field) => field.value === "");
      const checkedCheckbox = Array.from(checkboxes).some((checkbox) => checkbox.checked);
      const checkedRadio = Array.from(radios).some((radio) => radio.checked);

      const hasRequiredFields = requiredFields.length > 0;
      const hasCheckboxes = checkboxes.length > 0;
      const hasRadios = radios.length > 0;

      const isValidEmailFields = Array.from(requiredFields).every((field) => {
        if (field.type === "email") {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailPattern.test(field.value);
        }
        return true;
      });

      if (
        isValidEmailFields &&
        ((hasRequiredFields && hasCheckboxes && hasRadios && !areFieldsEmpty && checkedCheckbox && checkedRadio) ||
          (hasRequiredFields && hasCheckboxes && !hasRadios && !areFieldsEmpty && checkedCheckbox) ||
          (hasRequiredFields && !hasCheckboxes && hasRadios && !areFieldsEmpty && checkedRadio) ||
          (!hasRequiredFields && hasCheckboxes && hasRadios && checkedCheckbox && checkedRadio) ||
          (!hasRequiredFields && hasCheckboxes && !hasRadios && checkedCheckbox) ||
          (!hasRequiredFields && !hasCheckboxes && hasRadios && checkedRadio) ||
          (hasRequiredFields && !hasCheckboxes && !hasRadios && !areFieldsEmpty))
      ) {
        enableNextButton();
      } else {
        disableNextButton();
      }
    }

    function disableNextButton() {
      nextButton.classList.add("disabled");
      nextButton.style.cursor = "not-allowed";
      nextButton.disabled = true;
    }

    function enableNextButton() {
      nextButton.classList.remove("disabled");
      nextButton.style.cursor = "pointer";
      nextButton.disabled = false;
    }

    disableNextButton();

    requiredFields.forEach((field) => field.addEventListener("input", validateForm));
    checkboxes.forEach((checkbox) => checkbox.addEventListener("input", validateForm));
    radios.forEach((radio) => radio.addEventListener("input", validateForm));

    if (requiredFields.length === 0 && checkboxes.length === 0 && radios.length === 0) {
      enableNextButton();
    }
  });
};

formSliderValidationLogic();

const populateSliderDots = () => {
  const sliders = document.querySelectorAll('[form-slider]');

  document.querySelectorAll('[slider-counter]').forEach((counter, counterIndex) => {
    const dotTemplate = counter.querySelector('[slider-counter-dot]').cloneNode(true);

    counter.querySelectorAll('[slider-counter-dot]').forEach(dot => {
      dot.parentElement.removeChild(dot);
    });

    sliders.forEach((slider, sliderIndex) => {
      const dot = dotTemplate.cloneNode(true);
      if (sliderIndex === counterIndex) {
        dot.classList.add('dot-active');
      }
      counter.appendChild(dot);
    });
  });
}

populateSliderDots();

const populateProgressBar = () => {
  const progressBars = document.querySelectorAll("[progress-bar-content]");
  const progressBarTexts = document.querySelectorAll("[progress-bar-caption]");
  const sliders = document.querySelectorAll("[form-slider]");

  sliders.forEach((slider, sliderIndex) => {
    progressBarTexts.forEach((progressBarText, progressBarTextIndex) => {
      if (sliderIndex === progressBarTextIndex) {
        progressBarText.innerText = `${sliderIndex + 1} / ${sliders.length}`;
      }
    });

    progressBars.forEach((progressBar, progressBarIndex) => {
      const stepWidth = 100 / sliders.length;
      const width = (progressBarIndex <= sliderIndex) ? stepWidth * (progressBarIndex + 1) : 0;

      progressBar.style.width = `${width}%`;
    });
  });
};

populateProgressBar();

const radioStyleSelection = () => {
  const multiRadios = document.querySelectorAll(".multi_radio");
  
  multiRadios.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("active");
  
      multiRadios.forEach((otherButton) => {
        if (otherButton !== button) {
          otherButton.classList.remove("active");
        }
      });
    });
  });
}

radioStyleSelection();