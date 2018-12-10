<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class GamesmenuController extends AbstractController
{
    /**
     * @Route("/", name="gamesmenu")
     */
    public function index()
    {
        return $this->render('gamesmenu/index.html.twig', [
            'controller_name' => 'GamesmenuController',
        ]);
    }
}
