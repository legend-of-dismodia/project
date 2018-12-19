<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\User;
use App\Form\UserType;
use App\Form\ResetPasswordType;
use App\Form\EmailResetType;

use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\Save;
use Symfony\Component\Form\FormTypeInterface;

class UserController extends AbstractController
{
    /**
     * @Route("/login", name="login")
     */
    public function login(AuthenticationUtils $autentification)
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
    public function register(Request $request, ObjectManager $em, UserPasswordEncoderInterface $passwordEncoder)
    {
        $user = new User();
        $save = new Save();
        $form = $this->createForm(UserType::class, $user);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            $password = $passwordEncoder->encodePassword($user, $user->getPlainPassword());
            $user->setPassword($password);

            $user->setRoles(['ROLE_USER']);

            $em->persist($user);
            $em->flush(); 
            
            //Ajout de la première sauvegarde
            $save->setLife(100);
            $save->setCreatedAt(new \DateTime());
            $save->setLevel(1);
            $save->setMana(100);
            $save->setXp(0);
            $save->setUser($user);
            $playtime = new \DateTime();
            $playtime->setTime(00, 00, 00);
            $save->setPlaytime($playtime);

            $em->persist($save);
            $em->flush();

            $this->addFlash(
                'notice',
                'L\'utilisateur "' . $user->getUsername() . '" a bien été ajouté.'
            );

            return $this->redirectToRoute('login');
        }

        // return new Response($form->createView());
        return $this->render('user/register.html.twig', [
            'form' => $form->createView()
        ]);

    }

    /**
     * @Route("/reset", name="reset")
     */
    public function reset(Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $user = $this->getUser();
        $form = $this->createForm(ResetPasswordType::class, $user);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            $passwordEncoder = $this->get('security.password_encoder');
            $oldPassword = $request->request->get('etiquettebundle_user')['oldPassword'];

            // Si l'ancien mot de passe est bon
            if ($passwordEncoder->isPasswordValid($user, $oldPassword)) {
                $newEncodedPassword = $passwordEncoder->encodePassword($user, $user->getPlainPassword());
                $user->setPassword($newEncodedPassword);

                $em->persist($user);
                $em->flush();

                $this->addFlash('notice', 'Votre mot de passe a bien été changé !');

                return $this->redirectToRoute('profile');
            } else {
                $form->addError(new FormError('Ancien mot de passe incorrect'));
            }
        }

        return $this->render('user/reset.html.twig', [
            'form' => $form->createView(),
        ]);
    }


    /**
     * @Route("/forgot", name="forgot")
     */
    public function resetPassword(Request $request, \Swift_Mailer $mailer)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $form = $this->createForm(EmailResetType::class);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            $email = $form->getData()['email'];
            $user = $entityManager->getRepository(User::class)->findOneByEmail($email);
            if ($user !== null) {
                $token = uniqid();
                $user->setResetPassword($token);
                $entityManager->persist($user);
                $entityManager->flush();


                $message = (new \Swift_Message('Mot de passe oublié ?'))
                    ->setFrom('legendofdismodia@gmail.com')
                    ->setTo($email)
                    ->setBody(
                        $this->renderView(
                            'emails/forgot.html.twig',
                            array(
                                'username' => $user,
                                'token' => $token
                            )
                        ),
                        'text/html'
                    );
                    $mailer->send($message);


                // $mgClient = new Mailgun($this->getParameter('mailgun_api_key'));
                // $domain = $this->getParameter('mailgun_domain');
                // $mailFrom = $this->getParameter('mail_mail_from');
                // $nameFrom = $this->getParameter('mail_name_from');
                // $mailTo = $user->getEmail();
                // $result = $mgClient->sendMessage($domain, array(
                //     'from' => "$nameFrom <$mailFrom>",
                //     'to' => "<$mailTo>",
                //     'subject' => 'Mot de passe oublié ?',
                //     'html' => $this->renderView('emails/forgot.html.twig', array('token' => $token))
                // ));

                return $this->render('user/forgot-password-confirmation.html.twig');
            }
        }

        return $this->render('user/forgot-password.html.twig', array(
            'form' => $form->createView(),
        ));
    }

    /**
     * @Route("/forgot/token={token}", name="forgotToken")
     */
    public function resetPasswordToken(Request $request, UserPasswordEncoderInterface $encoder, $token)
    {
        
        // $token = $request->query->get('token');
        if ($token !== null) {
            $entityManager = $this->getDoctrine()->getManager();
            // $user = $entityManager->getRepository(User::class)->findOneByResetPassword($token);

            $user = $entityManager->getRepository(User::class)->findBy(array('resetPassword' => $token));

            if ($user !== null) {
                $form = $this->createForm(User::class, $user);

                $form->handleRequest($request);
                if ($form->isSubmitted() && $form->isValid()) {
                    $plainPassword = $form->getData()->getPlainPassword();
                    $encoded = $encoder->encodePassword($user, $plainPassword);
                    $user->setPassword($encoded);
                    $entityManager->persist($user);
                    $entityManager->flush();

                    //add flash

                    return $this->redirectToRoute('login');
                }

                return $this->render('authentication/reset-password-token.html.twig', array(
                    'form' => $form->createView(),
                ));
            }
            return new Response('Aucun utilisateur n\'est lié à ce token.');
        } else {
            // return new Response('ERREUR : le token est null.');
            var_dump($request->attributes->parameters);
            die();
        }
    }


}
