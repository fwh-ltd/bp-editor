/**
 * Toast UI Editor Fix for BuddyPress Activity Post Form
 * 
 * This script ensures that the Toast UI editor is properly integrated with the
 * existing BuddyPress activity post form and AJAX submission system.
 */

(function($) {
    'use strict';

    // Wait for DOM and all scripts to load
    $(document).ready(function() {
        console.log('Toast UI Fix: Initializing...');
        
        // Wait a bit more for all BuddyPress scripts to initialize
        setTimeout(function() {
            initializeToastUIFix();
        }, 1000);
    });

    function initializeToastUIFix() {
        console.log('Toast UI Fix: Starting initialization...');
        
        // Check if Toast UI is available
        if (typeof window.toastui === 'undefined') {
            console.error('Toast UI Fix: Toast UI library not found');
            return;
        }

        // Check if BuddyPress Activity is available
        if (typeof bp === 'undefined' || typeof bp.Nouveau === 'undefined' || typeof bp.Nouveau.Activity === 'undefined') {
            console.error('Toast UI Fix: BuddyPress Activity not found');
            return;
        }

        console.log('Toast UI Fix: Dependencies found, proceeding...');

        // Monitor for form state changes and ensure submit button is enabled
        monitorFormState();
        
        // Add event listeners for form interactions
        addFormEventListeners();
        
        // Ensure proper AJAX submission
        ensureAjaxSubmission();
        
        console.log('Toast UI Fix: Initialization complete');
    }

    function monitorFormState() {
        // Monitor the form for changes and ensure proper state
        var checkFormState = function() {
            var $form = $('#whats-new-form');
            var $submitBtn = $('#aw-whats-new-submit');
            
            if ($form.length && $submitBtn.length) {
                // Ensure form has focus-in class when editor is active
                if (window.activity_editor && typeof window.activity_editor.getHTML === 'function') {
                    $form.addClass('focus-in').removeClass('focus-in--empty');
                    
                    // Enable submit button
                    $submitBtn.prop('disabled', false);
                    
                    // Check if there's content
                    var content = window.activity_editor.getHTML();
                    if (content && content.trim() !== '' && content !== '<p><br></p>') {
                        $form.removeClass('focus-in--empty');
                    }
                }
            }
        };

        // Check form state periodically
        setInterval(checkFormState, 1000);
        
        // Also check when editor content changes
        if (window.activity_editor && typeof window.activity_editor.on === 'function') {
            window.activity_editor.on('change', checkFormState);
        }
    }

    function addFormEventListeners() {
        // Add click handler to ensure form is displayed when clicking on editor area
        $(document).on('click', '#whats-new', function() {
            var $form = $('#whats-new-form');
            if ($form.length) {
                $form.addClass('focus-in').removeClass('focus-in--empty');
                
                // Trigger the form display if it's not already visible
                if (!$form.hasClass('focus-in')) {
                    $(this).trigger('focusin');
                }
            }
        });

        // Add focus handler for the editor
        $(document).on('focusin', '#whats-new', function() {
            var $form = $('#whats-new-form');
            if ($form.length) {
                $form.addClass('focus-in').removeClass('focus-in--empty');
                
                // Ensure submit button is enabled
                var $submitBtn = $('#aw-whats-new-submit');
                if ($submitBtn.length) {
                    $submitBtn.prop('disabled', false);
                }
            }
        });
    }

    function ensureAjaxSubmission() {
        // Override the submit button click to ensure proper content extraction
        $(document).on('click', '#aw-whats-new-submit', function(e) {
            console.log('Toast UI Fix: Submit button clicked');
            
            // Ensure content is properly extracted from Toast UI editor
            if (window.activity_editor && typeof window.activity_editor.getMarkdown === 'function') {
                var content = window.activity_editor.getMarkdown();
                console.log('Toast UI Fix: Extracted markdown content:', content);
                
                // Update the form's content field
                var $whatsNew = $('#whats-new');
                if ($whatsNew.length) {
                    $whatsNew.html(content);
                }
                
                // Also update any hidden content fields
                var $contentField = $('input[name="content"], textarea[name="content"]');
                if ($contentField.length) {
                    $contentField.val(content);
                }
            }
            
            // Let the original form submission proceed
            return true;
        });

        // Also handle form submission directly
        $(document).on('submit', '#whats-new-form', function(e) {
            console.log('Toast UI Fix: Form submitted');
            
            // Ensure content is extracted before submission
            if (window.activity_editor && typeof window.activity_editor.getMarkdown === 'function') {
                var content = window.activity_editor.getMarkdown();
                console.log('Toast UI Fix: Form submission markdown content:', content);
                
                // Update the form's content
                var $whatsNew = $('#whats-new');
                if ($whatsNew.length) {
                    $whatsNew.html(content);
                }
            }
        });
    }

    // Add a manual trigger function for testing
    window.triggerToastUIForm = function() {
        console.log('Toast UI Fix: Manual trigger called');
        
        var $form = $('#whats-new-form');
        var $whatsNew = $('#whats-new');
        
        if ($form.length && $whatsNew.length) {
            // Ensure form is in focus state
            $form.addClass('focus-in').removeClass('focus-in--empty');
            
            // Trigger focus event
            $whatsNew.trigger('focusin');
            
            // If editor exists, focus it
            if (window.activity_editor && typeof window.activity_editor.focus === 'function') {
                setTimeout(function() {
                    window.activity_editor.focus();
                }, 100);
            }
            
            console.log('Toast UI Fix: Form triggered successfully');
        } else {
            console.error('Toast UI Fix: Form or editor element not found');
        }
    };

    // Add diagnostic function
    window.diagnoseToastUI = function() {
        console.log('=== TOAST UI DIAGNOSTIC ===');
        console.log('Toast UI available:', typeof window.toastui !== 'undefined');
        console.log('Activity editor exists:', typeof window.activity_editor !== 'undefined');
        console.log('Form found:', !!$('#whats-new-form').length);
        console.log('Submit button found:', !!$('#aw-whats-new-submit').length);
        console.log('Editor element found:', !!$('#whats-new').length);
        
        var $form = $('#whats-new-form');
        if ($form.length) {
            console.log('Form classes:', $form.attr('class'));
            console.log('Form has focus-in:', $form.hasClass('focus-in'));
        }
        
        var $submitBtn = $('#aw-whats-new-submit');
        if ($submitBtn.length) {
            console.log('Submit button disabled:', $submitBtn.prop('disabled'));
            console.log('Submit button value:', $submitBtn.val());
        }
        
        if (window.activity_editor) {
            console.log('Editor content:', window.activity_editor.getHTML());
        }
        
        console.log('=== END DIAGNOSTIC ===');
    };

})(jQuery); 