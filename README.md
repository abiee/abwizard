# jQuery ABWizard

Wizard widget for jQuery

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/abiee/abwizard/master/dist/jquery.abwizard.min.js
[max]: https://raw.github.com/abiee/abwizard/master/dist/jquery.abwizard.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.abwizard.min.js"></script>
<script>
jQuery(function($) {
  abwizard = $("#abwizard").ABWizard();
});
</script>
...
<div id="abwizard">
  <div id="welcome" class="step">
    <h1>Welcome to the jungle</h1>
    <p>This is ABWizard demo</p>
    <button class="wizard-next-button">Let's start!</button>
  </div>
  <div id="your-info" class="step">
    <h1>Tell us more about you</h1>
    <input type="text" placeholder="Firstname" />
    <input type="text" placeholder="Lastname" />
    <button class="wizard-previous-button">Go back</button>
    <button class="wizard-next-button">Continue</button>
  </div>
  <div id="the-dogs" class="step">
    <h1>Who let the dogs out?</h1>
    <input type="text" placeholder="Who?" />
    <button data-step="" class="wizard-action-button">Go Home</button>
    <button class="wizard-next-button">I'm done</button>
  </div>
  <div id="thank-you" data-href="im-ajax.html" class="step step-ajax"></div>
</div>

<!-- will set li active when selected -->
<div id="abwizard-navigation">
  <ul>
    <li class="welcome"><a href="">Step 1</a></li>
  </ul>
  <ul>
    <li class="your-info"><a href="">Step 2</a></li>
  </ul>
  <ul>
    <li class="the-dogs"><a href="">Step 3</a></li>
  </ul>
  <ul>
    <li class="thank-you"><a href="">Step 4</a></li>
  </ul>
</div>

```

## Documentation
To create a new wizard, first set a DOM properly based on div's with class 'step' and one step, take a look at this example.

```html
<div id="wizard">
  <div id="step1" class="step">Step 1<div>
  <div id="step2" class="step">Step 2<div>
  <div id="step3" class="step">Step 3<div>
</div>
```

You can add special buttons on any step to interact with the wizard, just add the needed class:

* __wizard-next-button__: Go to next step
* __wizard-previous-button__: Go to previous step
* __wizard-action-button__: With _data-step="stepx"_ go to stepx

For example
```html
<div id="wizard">
<div id="step1" class="step">
  <h3>Step 1</h3>
  <button class="wizard-next-button">Go to step 2</button>
<div>
<div id="step2" class="step">
  <h3>Step 2</h3>
  <button class="wizard-previous-button">Go to step 1</button>
  <button class="wizard-next-button">Go to step 3</button>
<div>
<div id="step3" class="step">
  <h3>Step 3</h3>
  <button class="wizard-previous-button">Go to step 2</button>
  <button data-step="step1" class="wizard-action-button">Go to step 1</button>
<div>
</div>
```

Once you have a DOM set, only apply __$("selector").ABWizard()__ to the div container of div steps.

```html
<script src="jquery.js"></script>
<script src="dist/jquery.abwizard.min.js"></script>
<script>
jQuery(function($) {
  abwizard = $("#wizard").ABWizard();
});
</script>
```

And that all.

### Navigation
Maybe you will need to navigate across all steps, this can be done with an navigation bar using next layout.

```html
<script src="jquery.js"></script>
<script src="dist/jquery.abwizard.min.js"></script>
<script>
jQuery(function($) {
  abwizard = $("#wizard").ABWizard({
    stepNavigation: "#step-navigation"
  });
});
...
<div id="step-navigation">
  <ul>
    <li class="step1"><a href="#">Step 1</a></li>
    <li class="step2"><a href="#">Step 1</a></li>
    <li class="step3"><a href="#">Step 1</a></li>
  </ul>
</div>
```

Indeed can be any element, what it's important here is the class must match with step id, another way to do it can be:

```html
<div id="step-navigation">
    <a class="step1" href="#">Step 1</a>
    <a class="step2" href="#">Step 2</a>
    <a class="step3" href="#">Step 3</a>
</div>
```

And ABWizard will add __active__ class on step changes automatically.

### Interact with the wizard from code
Now you can send commands to the wizard from your own code, to do this, use the object returned by ABWizard.

```html
<script src="jquery.js"></script>
<script src="dist/jquery.abwizard.min.js"></script>
<script>
jQuery(function($) {
  // Get the abwizard object
  abwizard = $("#wizard").ABWizard();
  // ...
  abwizard.next(); // move wizard to next step
});
</script>
```

This is the way you can customize wizard actions from your own code, piece of cake, this is the complete API:

* __first()__: Go to first step.
* __last()__: Go to last step.
* __next()__: Go to next step.
* __previous()__: Go to previous step.
* __goto(step_name)__: Go to step_name step.

### Step loaded from AJAX
IF you need to load a step from an AJAX call, add step-ajax class to step and provide the data-href to the page to load.

```html
<div id="wizard">
  <div id="step1" class="step">Step 1<div>
  <div id="step2" data-href="step2.html" class="step step-ajax"><div>
  <div id="step3" data-reload="true" data-href="step3.html" class="step step-ajax"><div>
</div>
```

Notice data-reload attribute on last step, if you set this to true ABWizard will make an AJAX call every time step is showed.

### Callbacks
Maybe you need that the wizard makes you a callback on step changes to allow you to make some sort of validation. On next example will show how to set a callback properly:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.abwizard.min.js"></script>
<script>
jQuery(function($) {
  // Get the abwizard object
  abwizard = $("#abwizard").ABWizard({
    beforeShowStep: function($stepToShow, $stepToHide) {
        if ($stepToHide.find("#name").value() == "") {
          alert("We need a name here");
          return false;
        }
    }
  });
});
</script>
```

Here is a complete list of callbacks available:

* __beforeAjaxLoad(stepDOM)__: Called exactly after load a step by ajax call. Maybe can be used to show an loader message.
* __afterAjaxLoad(stepDOM)__: Called after an successful ajax call.
* __onAjaxError(stepDOM)__: If something goes wrong with AJAX call, this will be called.
* __beforeShowStep(stepToShow, stepToHide)__: Called before start to show an step. For validations for example.
* __onShowStep(stepDOM)__: If step is showed successfully, this will be called.
* __onHideStep(stepDOM)__: Called exactly after hide step.


## Release History
0.0.1 [26 May 2013] - First alpha version
