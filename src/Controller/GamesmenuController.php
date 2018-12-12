<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

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
     * @Route("/contact", name="contact")
     */
    public function contact()
    {
        return $this->render('contact.html.twig', [
        ]);
    }
}