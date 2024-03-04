const form = document.querySelector('#wf-form-Enquiry-Form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputs = form.querySelectorAll('input, select, textarea');
  const values = {};

  inputs.forEach((input) => {
    if (input.type === 'radio' || input.type === 'checkbox') {
      values[input.name] = input.checked;
    } else {
      values[input.name] = input.value;
    }
  });

  const businessStage = values['Business-Stage-New'] ? 'New' : 'Existing';
  const outcome = Object.keys(values)
    .filter(key => key.startsWith('Outcome-') && values[key])
    .map(key => key.replace('Outcome-', '').replace('-', ' '))
    .join(', ');
  const businessOperatingCountry = Object.keys(values)
    .filter(key => key.startsWith('Business-Operating-Country-') && values[key])
    .map(key => key.replace('Business-Operating-Country-', ''))
    .join(', ');

  const payload = {
    "channel": `${process.env.SLACK_CHANNEL}`,
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "New Enquiry Submitted",
          "emoji": true
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "rich_text",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": `Name: `
              },
              {
                "type": "text",
                "text": `${values['first-name']} ${values['last-name']}\n`,
                "style": {
                  "bold": true
                }
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": `Job Title: `
              },
              {
                "type": "text",
                "text": `${values['job-title']}\n`,
                "style": {
                  "bold": true
                }
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": `Outcome: `
              },
              {
                "type": "text",
                "text": `${outcome}\n`,
                "style": {
                  "bold": true
                }
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": `Business Email: `
              },
              {
                "type": "text",
                "text": `${values['business-email']}\n`,
                "style": {
                  "bold": true
                }
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": `Business Phone: `
              },
              {
                "type": "text",
                "text": `${values['business-phone']}\n`,
                "style": {
                  "bold": true
                }
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": `Business Stage: `
              },
              {
                "type": "text",
                "text": `${businessStage}\n`,
                "style": {
                  "bold": true
                }
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": `Business Type: `
              },
              {
                "type": "text",
                "text": `${values['business-type']}\n`,
                "style": {
                  "bold": true
                }
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": `Business HQ: `
              },
              {
                "type": "text",
                "text": `${values['business-hq']}\n`,
                "style": {
                  "bold": true
                }
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": `Business Operating Country: `
              },
              {
                "type": "text",
                "text": `${businessOperatingCountry}\n`,
                "style": {
                  "bold": true
                }
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": `Global Head Count: `
              },
              {
                "type": "text",
                "text": `${values['Global-Head-Count']}\n`,
                "style": {
                  "bold": true
                }
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": `Website: `
              },
              {
                "type": "text",
                "text": `${values['website']}\n`,
                "style": {
                  "bold": true
                }
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "Brand Mission:\n\n"
              }
            ]
          },
          {
            "type": "rich_text_preformatted",
            "elements": [
              {
                "type": "text",
                "text": `${values['brand-mission']}`
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "\nIdeal Customer Profile:\n\n"
              }
            ]
          },
          {
            "type": "rich_text_preformatted",
            "elements": [
              {
                "type": "text",
                "text": `${values['ideal-customer-profile']}`
              }
            ]
          },
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "\nValue Proposition:\n\n"
              }
            ]
          },
          {
            "type": "rich_text_preformatted",
            "elements": [
              {
                "type": "text",
                "text": `${values['value-proposition']}`
              }
            ]
          },
        ]
      }
    ]
  }

  fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${process.env.SLACK_TOKEN}`
    },
    body: JSON.stringify(payload)
  })
});