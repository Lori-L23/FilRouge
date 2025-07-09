<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Contact;


class ContactFormSubmitted extends Mailable
{
    use Queueable, SerializesModels;
      public $formData;
      public $contact;

    /**
     * Create a new message instance.
     */
public function __construct(Contact $contact)
{
    $this->contact = $contact;
}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Contact Form Submitted',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
    public function build()
{
    return $this->subject('Nouveau message de contact: ' . $this->contact->subject)
                ->view('emails.contact')
                ->with(['contact' => $this->contact]);
}
}
