// import { App } from 'vue';

// import Navbar from '@/components/layout/Navbar.vue';
// import Footer from '@/components/layout/Footer.vue';
// import BaseButton from '@/components/base/BaseButton.vue';
// import BaseInput from '@/components/base/BaseInput.vue';
// import BaseSelect from '@/components/base/BaseSelect.vue';
// import BaseTextarea from '@/components/base/BaseTextarea.vue';
// import BaseForm from '@/components/base/BaseForm.vue';
// import ProgressBar from '@/components/layout/ProgressBar.vue';
// import WizardNav from '@/components/layout/WizardNav.vue';
// import WizardStepper from '@/components/layout/WizardStepper.vue';
// import WizardContainer from '@/components/layout/WizardContainer.vue';
// import HelpMeWriteModal from '@/components/layout/HelpMeWriteModal.vue';
// import Toasts from '@/components/layout/Toasts.vue';
// import Field from '@/components/base/Field.vue';

// export default {
//   install(app: App) {
//     // Core primitives
//     app.component('BaseButton', BaseButton);
//     app.component('BaseInput', BaseInput);
//     app.component('BaseSelect', BaseSelect);
//     app.component('BaseTextarea', BaseTextarea);

//     // Form
//     app.component('BaseForm', BaseForm);
//     app.component('FieldItem', Field);


//     // Wizard / Layout helpers
//     app.component('Navbar', Navbar);
//     app.component('Footer', Footer);
//     app.component('ProgressBar', ProgressBar);
//     app.component('WizardNav', WizardNav);
//     app.component('WizardContainer', WizardContainer);
//     app.component('WizardStepper', WizardStepper);

//     // Utilities / Overlays
//     app.component('HelpMeWriteModal', HelpMeWriteModal);
//     app.component('Toasts', Toasts);
//   }
// };
// src/plugins/global-components.ts
import { App } from 'vue';
import Navbar from '@/components/Navbar.vue';
import HeaderBar from '@/components/HeadBar.vue';
import BaseForm from '@/components/BaseForm.vue'
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BaseTextarea from '@/components/BaseTextarea.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import FieldItem from '@/components/FieldItem.vue'
import WizardNav from '@/components/WizardNav.vue';
import WizardStepper from '@/components/WizardStepper.vue';
import HelpMeWriteModal from '@/components/HelpMeWriteModal.vue';
import Toasts from '@/components/Toasts.vue';

export default {
  install(app: App) {
    // Core primitives
    app.component('Navbar', Navbar);
    app.component('HeaderBar', HeaderBar);
    app.component('BaseForm', BaseForm);
    app.component('FieldItem', FieldItem);
    app.component('BaseButton', BaseButton);
    app.component('BaseInput', BaseInput);
    app.component('BaseSelect', BaseSelect);
    app.component('BaseTextarea', BaseTextarea);

    // Wizard / Layout helpers
    app.component('ProgressBar', ProgressBar);
    app.component('WizardNav', WizardNav);
    app.component('WizardStepper', WizardStepper);

    // Utilities / Overlays
    app.component('HelpMeWriteModal', HelpMeWriteModal);
    app.component('Toasts', Toasts);
  }
};
