<?php
namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Form\ContactType;
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
     * @Route("/game/save", name="gameGetSave")
     */
    public function gameGetSave(EntityManagerInterface $em, Request $request)
    {
        $user = $this->getUser()->getId();

        $userSave = $em->getRepository('App:Save')->findOneBy(['user' => $user]);

        // $userInventory = $em->getRepository('App:Inventory')->findOneBy(['save' => $userSave->getId()]);

        $arrayUser = [

            'id' => $userSave->getId(),
            'createdAt'=> $userSave->getCreatedAt(),
            'level'=> $userSave->getLevel(),
            'life'=> $userSave->getLife(),
            'mana'=> $userSave->getMana(),
            'xp'=> $userSave->getXp(),
            'playtime'=> $userSave->getPlaytime(),
          // $array

          // 'inventory' => $userSave->getInventories()->$item(),
        ];


  return new JsonResponse($arrayUser);

          // var_dump($userInventory->());
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
        //     "playtime":{"date":"1970-01-01 00:00:00.000000","timezone_type":3,"timezone":"Europe/Berlin"}
        // }';

        $tbl = json_decode($tbl, true);

        $user = $this->getUser()->getId();
        $saveUser = $em->getRepository('App:Save')->findOneBy(['user' => $user]);

        if (!$saveUser) {
            throw $this->createNotFoundException(
                'No user found for id '.$id
            );
        }
        if ($tbl['life'] <= 0) {
            $saveUser->setLife(0);
        }else{
            $saveUser->setLife($tbl['life']);
        }
        $em->flush();

        return new Response('ok');
    }

    /**
    * @Route("/profil", name="profil")
    */
    public function profil()
    {
        return $this->render('user/profile.html.twig', [

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
