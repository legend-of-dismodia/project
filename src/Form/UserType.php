<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;


class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
        ->add('username',null, array(
            'help' => 'Votre nom d\'utilisateur doit faire au minimum 3 caratères.'))
        ->add('mail')
        ->add('plainPassword', PasswordType::class, array(
            'label' => 'Mot de passe',
            'help' => 'Votre mot de passe doit faire au minimum 6 caratères et doit contenir au moins 1 chiffre.'))        
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
