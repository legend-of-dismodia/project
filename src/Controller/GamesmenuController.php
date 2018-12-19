<?php
namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Form\ContactType;
use App\Entity\User;
use App\Entity\Save;
use App\Entity\Inventory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\HttpFoundation\Response;
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
    public function classement(EntityManagerInterface $em)
    {
        $userid = $this->getUser()->getId();
        $user= $em->getRepository('App:User')->findAll();
        // $userSave = $em->getRepository('App:Save')->findAll(['user' => $userid]);
        return $this->render('scores.html.twig', [
            "users" => $user,
            // "saves"=> $userSave,
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
     * @Route("/game/save", name="gameGetSave")
     */
    public function gameGetSave(EntityManagerInterface $em, Request $request)
    {
        $user = $this->getUser()->getId();

        $userSave = $em->getRepository('App:Save')->findOneBy(['user' => $user]);
        $userInventory = $em->getRepository('App:Inventory')->getPlayerInventory($userSave->getId());

        foreach ($userInventory as $key => $value) {
            $userInventory[$key]['property']  =  unserialize($value['property']);
        }        

        $arrayUser = [

            'id' => $userSave->getId(),
            'createdAt'=> $userSave->getCreatedAt(),
            'level'=> $userSave->getLevel(),
            'life'=> $userSave->getLife(),
            'mana'=> $userSave->getMana(),
            'xp'=> $userSave->getXp(),
            'playtime'=> $userSave->getPlaytime(),
            'inventory' => $userInventory,
        ];

        return new JsonResponse($arrayUser);
        // var_dump($arrayUser);
        // die();
    }

    /**
     * @Route("/game/setSave", name="gameSetSave")
     */
    public function gameSetSave(EntityManagerInterface $em, Request $request)
    {
        $tbl = $_POST['tbl'];
        // $tbl = '{
        //     "life":90,
        //     "createdAt":{"date":"2018-12-14 14:27:07.000000","timezone_type":3,"timezone":"Europe/Berlin"},
        //     "level":0,
        //     "mana":200,
        //     "xp":0,
        //     "playtime":{"date":"1970-01-01 00:00:00.000000","timezone_type":3,"timezone":"Europe/Berlin"},
        //     "inventories":[{"name":"Potion","property":{"hp":50},"rarety":"1","image":"","quantity":"2"},{"name":"Sword","property":{"atk":10},"rarety":"1","image":"","quantity":"1"}]
        // }';

        $tbl = json_decode($tbl, true);

        $user = $this->getUser()->getId();
        $saveUser = $em->getRepository('App:Save')->findOneBy(['user' => $user]);

        $saveUserInventory = $em->getRepository('App:Inventory')->findOneBy(['save' => $saveUser->getId()]);

        $userInventory = $em->getRepository('App:Inventory')->getPlayerInventory($saveUser->getId());
        

        if (!$saveUser) {
            throw $this->createNotFoundException(
                'No user found for id '.$id
            );
        }
        if ($tbl['life'] <= 0) {
            $saveUser->setLife(0);
        }else{
            $saveUser->setLife($tbl['life']);
            $saveUser->setXp($tbl['xp']);
            $saveUser->setLevel($tbl['level']);
            //inventory here            
            foreach ($tbl['inventories'] as $key => $value) {
                if ($value['quantity'] != $userInventory[$key]['quantity']) {                    
                    $saveUserInventory->setQuantity($value['quantity']);
                }
            }
            
        }
        $em->flush();

        return new Response('Mise à jour de la save');
    }

    /**
    * @Route("/profil", name="profil")
    */

    public function profil(EntityManagerInterface $em)
   {
       $userid = $this->getUser()->getId();
       $user= $em->getRepository('App:User')->findOneBy(['id' => $userid]);
       $userSave = $em->getRepository('App:Save')->findOneBy(['user' => $userid]);
       $userInventory = $em->getRepository('App:Inventory')->getPlayerInventory($userSave->getId());
      
       foreach ($userInventory as $key => $value) {
        $userInventory[$key]['property']  =  unserialize($value['property']);
    }
       return $this->render('user/profile.html.twig', [
        "user" => $user,
        "save" => $userSave,
        "inventorys" =>$userInventory,

       ]);
   }
   /**
    * @Route("/compte", name="compte")
    */

    public function compte(EntityManagerInterface $em)
   {
       $userid = $this->getUser()->getId();
       $user= $em->getRepository('App:User')->findOneBy(['id' => $userid]);


       return $this->render('user/compte.html.twig', [
        "user" => $user,

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
                $email = $form['email']->getData();
                $message = $form['message']->getData();
            } else {
                $name = 'undefined';
                $email = 'undefined';
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
