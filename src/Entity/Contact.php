<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ContactRepository")
 */
class Contact
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank(
     *      message = "Le champ ne contient pas de nom.")
     * @Assert\Length(
     *      min = 2,
     *      max = 20,     
     *      minMessage = "Votre nom doit faire {{ limit }} caractères minimum.",
     *      maxMessage = "Votre nom doit faire {{ limit }} caractères  maximum.", 
     * )
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Email(
     *     message = "L'email '{{ value }}' n'est pas valide."
     * )
     */
    private $email;

    /**
     * @ORM\Column(type="text")
     * @Assert\NotBlank(
     *      message = "Le champ ne contient pas de message.")
     * @Assert\Length(
     *      min = 10,
     *      max = 500,     
     *      minMessage = "Votre message doit faire {{ limit }} caractères minimum.",
     *      maxMessage = "Votre message doit faire {{ limit }} caractères  maximum.", 
     * )
     */
    private $message;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }
}
