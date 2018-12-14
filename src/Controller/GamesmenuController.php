<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

use App\Form\ContactType;

class GamesmenuController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function index()
    {
        return $this->render('gamesmenu/index.html.twig', [
            'controller_name' => 'GamesmenuController',
        ]);
    }
    /**
     * @Route("/guide", name="guide")
     */
    public function guide()
    {
        return $this->render('gamesguide.html.twig', [
            'controller_name' => 'GamesmenuController',
        ]);
    }
    /**
     * @Route("/classement", name="classement")
     */
    public function classement()
    {
        return $this->render('scores.html.twig', [
            'controller_name' => 'GamesmenuController',
        ]);
    }

    /**
     * @Route("/game", name="game")
     */
    public function game()
    {
        return $this->render('gamesmenu/game.html.twig', [
        
        ]);
    }
    /**
     * @Route("/contact", name="contact")
     */
    public function contact(Request $request, \Swift_Mailer $mailer)
    {
        $form = $this->createForm(ContactType::class);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            // $sent = $form->getData();

            if (isset($form)) {
                $name = $form['name']->getData();
            } else {
                $name = 'undefined';
            }
            if (isset($form)) {
                $email = $form['email']->getData();
            } else {
                $email = 'undefined';
            }
            if (isset($form)) {
                $message = $form['message']->getData();
            } else {
                $message = 'undefined';
            }




            $message = (new \Swift_Message('Nouveau message sur Legend of Dismodia !'))
                ->setFrom('send@example.com')
                ->setTo('legendofdismodia@gmail.com')
                ->setBody(
                    $this->renderView(
                        'emails/contact.html.twig',
                        array(
                            'name' => $name,
                            'email' => $email,
                            'message' => $message
                            )
                    ),
                    'text/html'
                )
        /*
             * If you also want to include a plaintext version of the message
        ->addPart(
            $this->renderView(
                'emails/registration.txt.twig',
                array('name' => $name)
            ),
            'text/plain'
        )
             */;

            $mailer->send($message);
        }

        return $this->render('contact.html.twig', [
            'form' => $form->createView()
        ]);
    }
}
