document.addEventListener('DOMContentLoaded', () => {
  let segmentAnalytics;
  let gaAnalytics;
  
  if (typeof analytics !== 'undefined') {
    segmentAnalytics = analytics;
  }
  
  const devhausTrackingCodeScript = document.querySelector('#devhaus-tracking-code');
  const googleMeasurementId = devhausTrackingCodeScript.getAttribute('google-measurement-id');
  const trackByDefault = devhausTrackingCodeScript.getAttribute('track-by-default');
  
  if (googleMeasurementId) {
    gaAnalytics = _analytics.Analytics({
      app: 'devhaus-tracking-code',
      plugins: [
        analyticsGa.init({
          measurementIds: [googleMeasurementId]
        })
      ]
    });
  }
  
  const trackEvent = async (eventName, property) => {
    if (!segmentAnalytics && !googleMeasurementId) {
      console.log('Segment snippets and Google Measurement ID is not found')
      return;
    }
  
    if (trackByDefault === 'true' || localStorage.getItem('devhaus-consent') === 'true') {
      if (segmentAnalytics) {
        const firedEvent = await segmentAnalytics.track(eventName, { ...property, metadata: getMetadata() });
        // console.log(firedEvent, 'segment');
      } else {
        const firedEvent = await gaAnalytics.track(eventName, { ...property, metadata: getMetadata() });
        // console.log(firedEvent, 'google analytics');
      }
    }
  }
  
  const pageEvent = async (eventName, property) => {
    if (!segmentAnalytics && !googleMeasurementId) {
      console.log('Segment snippets and Google Measurement ID is not found')
      return;
    }
  
    if (trackByDefault === 'true' || localStorage.getItem('devhaus-consent') === 'true') {
      if (segmentAnalytics) {
        const firedEvent = await segmentAnalytics.track(eventName, { ...property, metadata: getMetadata() });
        // console.log(firedEvent, 'segment');
      } else {
        const firedEvent = await gaAnalytics.track(eventName, { ...property, metadata: getMetadata() });
        // console.log(firedEvent, 'google analytics');
      }
    }
  }
  
  const identifyEvent = async (property) => {
    if (!segmentAnalytics && !googleMeasurementId) {
      console.log('Segment snippets and Google Measurement ID is not found')
      return;
    }
  
    if (trackByDefault === 'true' || localStorage.getItem('devhaus-consent') === 'true') {
      if (segmentAnalytics) {
        const firedEvent = await segmentAnalytics.identify(property);
        // console.log(firedEvent, 'segment');
      } else if (googleMeasurementId) {
        const firedEvent = await gaAnalytics.identify(property);
        // console.log(firedEvent, 'google analytics');
      }
    }
  }
  
  const getMetadata = () => {
    const query = window.location.search;
    const search = new URLSearchParams(query);
    return {
      source: search.get("utm_source") || "direct",
      medium: search.get("utm_medium"),
      campaign: search.get("utm_campaign"),
    };
  };
  
  const dataPageEvent = () => {
    const path = window.location.pathname;
    const metadata = getMetadata();
  
    const eventName = document.querySelector("body[data-event]")?.attributes["data-event"]?.value;
  
    if (!eventName) return;
  
    pageEvent(eventName, {
      path,
      metadata,
    });
  };
  
  dataPageEvent();
  
  const extractProperties = (element) => {
    const attributeNamePattern = /^data-property-name\d+$/;
    const attributes = element.attributes;
    const properties = [];
  
    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];
      const attributeId = attribute.name;
  
      if (attributeNamePattern.test(attributeId)) {
        const propertyName = attribute.value;
        if (propertyName.includes(":")) {
          properties.push({
            id: attributeId,
            name: propertyName.split(":")[0],
            value: propertyName.split(":")[1].trim(),
          });
        } else {
          properties.push({ id: attributeId, name: propertyName, value: "" });
        }
      }
    }
  
    return properties;
  };
  
  const dataTrackEvents = () => {
    document.body.querySelectorAll("[data-event]").forEach((el) => {
      const eventName = el.getAttribute("data-event");
      const path = window.location.pathname;
      const metadata = getMetadata();
      const properties = extractProperties(el);
  
      if (el.tagName === 'FORM') {
        el.addEventListener("submit", (e) => {
          const formElements = el.querySelectorAll('[data-track="true"]');
          const eventProperties = {};
          const properties = extractProperties(el);
  
          properties.forEach((el) => {
            eventProperties[el.name] = el.value;
          });
          
          eventProperties.path = path;
          eventProperties.metadata = metadata;
  
          formElements.forEach((el) => {
            const elementType = el.type;
            
            let elementValue;
            if (elementType === "checkbox" || elementType === "radio") {
              if (el.checked) {
                elementValue = el.value;
              } else return
            } else {
              elementValue = el.value;
            }
  
            eventProperties[el.id] = elementValue;
          });
  
          trackEvent(eventName, eventProperties);
        });
        return;
      }
  
      if (!el.getAttribute("search-input")) {
        el.onclick = (e) => {
          const eventProperties = {};
    
          properties.forEach((el) => {
            eventProperties[el.name] = el.value.trim();
          });
      
          eventProperties.path = path;
          eventProperties.metadata = metadata;
      
          const isValid = Object.values(eventProperties).every((value) => value);
      
          if (!isValid) return;
      
          trackEvent(eventName, eventProperties);
        };
      }
    });
  }
  
  dataTrackEvents();
  
  const dataIdentifyEvents = () => {
    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        const formElements = form.querySelectorAll('[data-identify="true"]');
        const eventProperties = {};
        const properties = extractProperties(form);
  
        properties.forEach((el) => {
          eventProperties[el.name] = el.value;
        });
  
        formElements.forEach((el) => {
          const elementType = el.type;
          
          let elementValue;
          if (elementType === "checkbox" || elementType === "radio") {
            if (el.checked) {
              elementValue = el.value;
            } else return
          } else {
            elementValue = el.value;
          }
  
          eventProperties[el.id] = elementValue;
        });
  
        identifyEvent(eventProperties);
      });
    });
  }
  
  dataIdentifyEvents();
  
  const searchInputTrack = () => {
    const searchInput = document.querySelector('[search-input]');
    if (!searchInput) return;
  
    const eventName = searchInput.getAttribute("data-event");
    const path = window.location.pathname;
    const metadata = getMetadata();
    const properties = extractProperties(searchInput);
  
    const eventProperties = {};
    properties.forEach((el) => {
      eventProperties[el.name] = el.value;
    });
    
    eventProperties.path = path;
    eventProperties.metadata = metadata;
  
    let typingTimer;
    const doneTypingInterval = 2000;
  
    searchInput.addEventListener('input', function (e) {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        if (!e.target.value || e.target.value === '') return;
        eventProperties.search = e.target.value;
        trackEvent(eventName, eventProperties);
      }, doneTypingInterval);
    });
  }
  
  searchInputTrack();
  
  const renderConsentManager = () => {
    const consentManager = document.querySelector('[devhaus-consent-manager]');
    if (!consentManager) return;

    const consentAcceptButton = consentManager.querySelector('[devhaus-consent-button=accept]');
    const consentDeclineButton = consentManager.querySelector('[devhaus-consent-button=decline]');
  
    consentAcceptButton.addEventListener('click', () => {
      localStorage.setItem('devhaus-consent', 'true');
    })
  
    consentDeclineButton.addEventListener('click', () => {
      localStorage.setItem('devhaus-consent', 'false');
    })
  
    if (!localStorage.getItem('devhaus-consent')) {
      consentManager.style.display = 'flex';
      consentManager.style.opacity = '0';
      consentManager.style.transform = 'translateY(30px)';
      consentManager.style.transition = 'opacity 0.3s linear, transform 0.3s linear';
  
      requestAnimationFrame(() => {
        consentManager.style.opacity = '1';
        consentManager.style.transform = 'translateY(0)';
      });
    }
  }
  
  renderConsentManager();
});