<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\User;
use App\Form\UserType;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpFoundation\Response;

class UserController extends AbstractController
{
    /**
     * @Route("/login", name="login")
     */
    public function login( AuthenticationUtils $autentification)
    {
        return $this->render('user/login.html.twig', [
            'lastUsername' => $autentification->getLastUsername(),
            'error' => $autentification->getLastAuthenticationError(),
            // 'form' => $this->register($request, $em, $passwordEncoder)
        ]);
    }

    /**
    * @Route("/register", name="register")
    */
    public function register( Request $request, ObjectManager $em, UserPasswordEncoderInterface $passwordEncoder )
    {
        $user = new User();
        $form = $this->createForm( UserType::class, $user );

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {            
            
            $password = $passwordEncoder->encodePassword($user, $user->getPlainPassword());
            $user->setPassword($password);            

            $user->setRoles(['ROLE_USER']);

            $em->persist( $user );
            $em->flush();            

            $this->addFlash(
                'notice',
                'L\'utilisateur "'. $user->getUsername() .'" a bien été ajouté'
            );

            return $this->redirectToRoute('login');
        }

        // return new Response($form->createView());
        return $this->render('user/register.html.twig', [            
            'form' => $form->createView()
        ]);
        
    }
}
