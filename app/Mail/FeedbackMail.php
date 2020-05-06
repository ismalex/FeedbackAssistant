<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\StudentMark;

class FeedbackMail extends Mailable
{
    use Queueable, SerializesModels;

    public $attachmentPath;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($attachmentPath)
    {
        //
        $this->attachmentPath = $attachmentPath;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('mail.feedback')
                    ->attachFromStorageDisk('c_path', $this->attachmentPath);
    }
}
