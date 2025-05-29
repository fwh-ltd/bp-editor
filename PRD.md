We want to do extensive customization here.

We're not only trying to rip out the wrapper <p/> tags from the text that gets posted to the (mock) HTTP endpoint, but also make markdown the primary editing format. 

We need functionality to:

1. allow media uploads that go to a custom CDN, not just uploaded to buddyboss.

The CDN logic will be provided at a later time so that we can extend what's here. For now mocking uploads is enough.

2. have the primary editor be a markdown editor.
  1. including for those images being potentially drag/drop added in.
  2. including graphical editing wysiwyg, or dropping down to markdown source editing (or could be markdown with preview)

3. allow tags to be specified per post, but not embedded in the primary doc, and rather in as markdown frontmatter. in the UI, we would have a separate field for adding tags that edits the frontmatter if done in wysiwyg mode.

===

We have several non-minified files under src/

- src/buddypress-activity-post-form.js
- src/buddypress-activity.js
- src/buddypress-nouveau.js

We'll implement what we need here, and then we'll minify and copy to buddyboss-timeline_files/

===

Decisions:

- Replace TinyMCE with ToastUI