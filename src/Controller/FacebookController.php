<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;


class FacebookController extends AbstractController
{
    /**
     * Link to this controller to start the "connect" process
     *
     * @Route("/login/facebook", name="connect_facebook_start")
     */
    public function connectAction(ClientRegistry $clientRegistry)
    {
            
        // will redirect to Facebook!
        return $clientRegistry
            ->getClient('facebook_main') // key used in config/packages/knpu_oauth2_client.yaml
            ->redirect([
            'public_profile', 'email' // the scopes you want to access
            ])
        ;
    }

    /**
    *
    * @Route("/login/facebook/check", name="connect_facebook_check")
    */
    public function connectCheckAction(UserPasswordEncoderInterface $passwordEncoder, Request $request, ObjectManager $em, ClientRegistry $clientRegistry)
    {
        
        /** @var \KnpU\OAuth2ClientBundle\Client\Provider\FacebookClient $client */
        $client = $clientRegistry->getClient('facebook_main');

        try {
            
            $user = new User();
            // get the access token and then user
            $accessToken = $client->getAccessToken();
            $facebookUser = $client->fetchUserFromToken($accessToken);          

            $email = $facebookUser->getEmail();            
            $fbId = $facebookUser->getId();
            
            
            $existingUser = $em->getRepository('App:User')->findOneBy(['facebookId' => $fbId]);
            
            if ($existingUser) {
                
                // Manually authenticate user in controller
                $token = new UsernamePasswordToken($existingUser, $existingUser->getPassword(), 'main', $existingUser->getRoles());
                $this->get('security.token_storage')->setToken($token);
                $this->get('session')->set('_security_main', serialize($token));

                return $this->redirectToRoute('index'); 
            }else{
                
                $user->setUsername($facebookUser->getName()); 
    
                $password = $passwordEncoder->encodePassword($user, $fbId);
                $user->setPassword($password);
    
                var_dump($fbId);
                var_dump($user->setFacebookId($fbId));

                $user->setFacebookId($fbId);
                $user->setRoles(['ROLE_USER']);
                $user->setEmail($email);
    
                $em->persist($user);
                $em->flush();
    
                $this->addFlash(
                    'notice',
                    'Vous êtes bien connecté avec votre compte '. $user->getUsername()
                );
                
                // Manually authenticate user in controller
                $token = new UsernamePasswordToken($user, $user->getPassword(), 'main', $user->getRoles());
                $this->get('security.token_storage')->setToken($token);
                $this->get('session')->set('_security_main', serialize($token));
    
                
                return $this->redirectToRoute('index');           

            }


        } catch (IdentityProviderException $e) {
            // something went wrong!
            // probably you should return the reason to the user
            var_dump($e->getMessage()); die;
        }
    }
}
